#!/usr/bin/env python3
"""
Comprehensive scraper that visits individual package pages
to extract complete holiday package details
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime

def scrape_package_details(package_url, destination_name):
    """Scrape detailed information from an individual package page"""
    print(f"\n{'='*60}")
    print(f"SCRAPING PACKAGE DETAILS: {destination_name}")
    print(f"URL: {package_url}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(package_url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Extract package name
        name_selectors = [
            'h1', 'h2', 
            '[class*="title"]',
            '[class*="package-title"]',
            '[class*="tour-title"]',
            '.page-title',
            '#package-title'
        ]
        
        name = None
        for sel in name_selectors:
            elem = soup.select_one(sel)
            if elem:
                name = elem.get_text(strip=True)
                if name and len(name) > 5:
                    break
        
        if not name:
            name = destination_name + " Package"
        
        # Extract price with multiple patterns
        price_patterns = [
            r'₹\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'Rs\.\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'Rs\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'INR\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'Price[:\s]*₹\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'Starting from[:\s]*₹\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'Cost[:\s]*₹\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
        ]
        
        price = "N/A"
        text_content = response.text
        
        for pattern in price_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                # Take the first reasonable price
                for match in matches:
                    # Clean and validate the price
                    clean_price = re.sub(r'[^\d,]', '', match)
                    if clean_price and len(clean_price) > 2:
                        # Convert to standard format
                        if '₹' in match or 'Rs' in match or 'INR' in match:
                            price = f"₹{clean_price}"
                        else:
                            price = f"${clean_price}"
                        print(f"  Found price: {price}")
                        break
                if price != "N/A":
                    break
        
        # Extract duration with multiple patterns
        duration_patterns = [
            r'(\d+)\s*(?:days?|nights?)\s*(?:[-–]\s*(\d+)\s*(?:days?|nights?))?',
            r'(\d+)\s*[dD]\s*(?:[-–]\s*(\d+)\s*[dD])?',
            r'(\d+)\s*[nN]\s*(?:[-–]\s*(\d+)\s*[nN])?',
            r'Duration[:\s]*(\d+)\s*(?:days?|nights?)',
            r'Package[:\s]*(\d+)\s*(?:days?|nights?)',
            r'Trip[:\s]*(\d+)\s*(?:days?|nights?)',
        ]
        
        duration = "N/A"
        for pattern in duration_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                match = matches[0]
                if isinstance(match, tuple):
                    if len(match) == 2 and match[1]:
                        duration = f"{match[0]}-{match[1]} days"
                    else:
                        duration = f"{match[0]} days"
                else:
                    duration = f"{match} days"
                print(f"  Found duration: {duration}")
                break
        
        # Extract inclusions
        inclusions = extract_inclusions(soup, text_content)
        
        # Extract highlights
        highlights = extract_highlights(soup, text_content)
        
        # Extract rating if available
        rating = extract_rating(soup, text_content)
        
        # Create comprehensive package object
        package_details = {
            'name': name,
            'price': price,
            'duration': duration,
            'url': package_url,
            'destination': destination_name,
            'inclusions': inclusions,
            'highlights': highlights,
            'rating': rating,
            'scraped_at': datetime.now().isoformat(),
            'source_url': package_url
        }
        
        print(f"✓ Successfully scraped: {name}")
        print(f"  Price: {price}")
        print(f"  Duration: {duration}")
        print(f"  Rating: {rating}")
        print(f"  Inclusions: {len(inclusions.split(',')) if inclusions != 'N/A' else 0} items")
        
        return package_details
        
    except Exception as e:
        print(f"Error scraping {package_url}: {e}")
        return {
            'name': f"{destination_name} Package",
            'price': "N/A",
            'duration': "N/A",
            'url': package_url,
            'destination': destination_name,
            'inclusions': "N/A",
            'highlights': "N/A",
            'rating': None,
            'scraped_at': datetime.now().isoformat(),
            'source_url': package_url,
            'error': str(e)
        }

def extract_inclusions(soup, text_content):
    """Extract package inclusions"""
    inclusions_selectors = [
        '[class*="inclusion"]',
        '[class*="include"]',
        '[class*="facility"]',
        '[class*="amenity"]',
        '.inclusions',
        '.includes',
        '.what-includes'
    ]
    
    for sel in inclusions_selectors:
        elements = soup.select(sel)
        if elements:
            inclusions_text = ', '.join([elem.get_text(strip=True) for elem in elements])
            if inclusions_text and len(inclusions_text) > 10:
                return inclusions_text[:500]  # Limit length
    
    # Look for inclusion keywords in text
    inclusion_keywords = [
        'includes', 'included', 'accommodation', 'transport', 'meals',
        'sightseeing', 'guide', 'entrance', 'transfer', 'hotel', 'flight'
    ]
    
    lines = text_content.split('\n')
    inclusions = []
    for line in lines:
        if any(keyword.lower() in line.lower() for keyword in inclusion_keywords):
            clean_line = line.strip()
            if clean_line and len(clean_line) > 5 and len(clean_line) < 100:
                inclusions.append(clean_line)
    
    return ', '.join(inclusions[:5]) if inclusions else "N/A"

def extract_highlights(soup, text_content):
    """Extract package highlights"""
    highlights_selectors = [
        '[class*="highlight"]',
        '[class*="feature"]',
        '[class*="attraction"]',
        '[class*="activity"]',
        '.highlights',
        '.features',
        '.activities'
    ]
    
    for sel in highlights_selectors:
        elements = soup.select(sel)
        if elements:
            highlights_text = ', '.join([elem.get_text(strip=True) for elem in elements])
            if highlights_text and len(highlights_text) > 10:
                return highlights_text[:500]  # Limit length
    
    return "N/A"

def extract_rating(soup, text_content):
    """Extract package rating"""
    rating_patterns = [
        r'(\d+\.?\d*)\s*[\/]?5',
        r'(\d+\.?\d*)\s*stars?',
        r'Rating[:\s]*(\d+\.?\d*)',
        r'Score[:\s]*(\d+\.?\d*)',
    ]
    
    for pattern in rating_patterns:
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            try:
                rating = float(matches[0])
                if 0 <= rating <= 5:
                    return rating
            except:
                continue
    
    return None

def find_more_packages(destination_url, destination_name):
    """Find additional packages from destination pages"""
    print(f"\nLooking for more packages in {destination_name}...")
    
    try:
        response = requests.get(destination_url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Find package links
        package_links = []
        
        # Look for package/tour links
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/packages/' in href and 'traveltriangle.com' in href or href.startswith('/packages/'):
                full_url = href if href.startswith('http') else f"https://traveltriangle.com{href}"
                
                # Get link text for potential package name
                link_text = link.get_text(strip=True)
                if link_text and len(link_text) > 5 and len(link_text) < 100:
                    package_links.append({
                        'url': full_url,
                        'name': link_text
                    })
        
        # Remove duplicates
        seen_urls = set()
        unique_links = []
        for link in package_links:
            if link['url'] not in seen_urls:
                seen_urls.add(link['url'])
                unique_links.append(link)
        
        print(f"Found {len(unique_links)} potential package links")
        return unique_links[:10]  # Limit to top 10
        
    except Exception as e:
        print(f"Error finding more packages: {e}")
        return []

def main():
    """Main scraping function"""
    print("COMPREHENSIVE TRAVELTRIANGLE PACKAGE SCRAPER")
    print("=" * 80)
    
    # Load previously found packages
    try:
        with open('extracted_packages.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            initial_packages = data.get('packages', [])
    except:
        initial_packages = []
    
    # Add some popular destinations to scrape
    additional_destinations = [
        ("https://traveltriangle.com/tour-packages/kerala", "Kerala"),
        ("https://traveltriangle.com/tour-packages/goa", "Goa"),
        ("https://traveltriangle.com/tour-packages/kashmir", "Kashmir"),
        ("https://traveltriangle.com/tour-packages/bali", "Bali"),
        ("https://traveltriangle.com/tour-packages/rajasthan", "Rajasthan"),
        ("https://traveltriangle.com/tour-packages/thailand", "Thailand"),
        ("https://traveltriangle.com/tour-packages/dubai", "Dubai"),
        ("https://traveltriangle.com/tour-packages/singapore", "Singapore"),
    ]
    
    all_packages = []
    
    # First, scrape detailed info for known packages
    for pkg in initial_packages:
        print(f"\nProcessing known package: {pkg['name']}")
        detailed_pkg = scrape_package_details(pkg['url'], pkg['destination'])
        if detailed_pkg:
            all_packages.append(detailed_pkg)
        time.sleep(2)  # Be respectful to the server
    
    # Then, find and scrape more packages from destination pages
    for dest_url, dest_name in additional_destinations:
        print(f"\n{'='*80}")
        print(f"SCRAPING DESTINATION: {dest_name}")
        print(f"{'='*80}")
        
        # Find more packages in this destination
        package_links = find_more_packages(dest_url, dest_name)
        
        # Scrape details for each package
        for i, link_info in enumerate(package_links[:5]):  # Limit to 5 per destination
            print(f"\nScraping package {i+1}/{min(5, len(package_links))} from {dest_name}")
            detailed_pkg = scrape_package_details(link_info['url'], dest_name)
            if detailed_pkg:
                all_packages.append(detailed_pkg)
            time.sleep(3)  # Be respectful to the server
    
    # Remove duplicates based on URL
    seen_urls = set()
    unique_packages = []
    for pkg in all_packages:
        if pkg['url'] not in seen_urls:
            seen_urls.add(pkg['url'])
            unique_packages.append(pkg)
    
    # Save comprehensive results
    output_data = {
        "metadata": {
            "scraped_at": datetime.now().isoformat(),
            "source": "https://traveltriangle.com/",
            "scraper_version": "3.0.0",
            "total_packages": len(unique_packages),
            "destinations_covered": len(set(pkg['destination'] for pkg in unique_packages))
        },
        "packages": unique_packages
    }
    
    output_file = f"comprehensive_packages_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*80}")
    print("COMPREHENSIVE SCRAPING COMPLETE")
    print("="*80)
    print(f"Total unique packages: {len(unique_packages)}")
    print(f"Results saved to: {output_file}")
    
    # Show summary statistics
    from collections import Counter
    dest_counts = Counter(pkg['destination'] for pkg in unique_packages)
    print(f"\nPackages by destination:")
    for dest, count in dest_counts.most_common():
        print(f"  {dest}: {count} packages")
    
    # Show price statistics
    prices = []
    for pkg in unique_packages:
        if pkg['price'] != "N/A":
            # Extract numeric price
            price_match = re.search(r'(\d+(?:,\d+)*)', pkg['price'])
            if price_match:
                price_num = int(price_match.group(1).replace(',', ''))
                prices.append(price_num)
    
    if prices:
        print(f"\nPrice statistics:")
        print(f"  Min price: ₹{min(prices):,}")
        print(f"  Max price: ₹{max(prices):,}")
        print(f"  Avg price: ₹{sum(prices)//len(prices):,}")
    
    # Show sample packages
    print(f"\nSample packages:")
    for i, pkg in enumerate(unique_packages[:5]):
        print(f"\n{i+1}. {pkg['name']}")
        print(f"   Destination: {pkg['destination']}")
        print(f"   Price: {pkg['price']}")
        print(f"   Duration: {pkg['duration']}")
        print(f"   URL: {pkg['url']}")

if __name__ == "__main__":
    main()
