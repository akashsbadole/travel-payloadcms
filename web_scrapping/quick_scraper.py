#!/usr/bin/env python3
"""
Fast and efficient scraper to get essential holiday package data
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

def quick_scrape_packages():
    """Quickly scrape packages from multiple destinations"""
    print("QUICK HOLIDAY PACKAGE SCRAPER")
    print("=" * 50)
    
    # Popular destinations with package URLs
    destinations = [
        ("Kerala", "https://traveltriangle.com/tour-packages/kerala"),
        ("Goa", "https://traveltriangle.com/tour-packages/goa"),
        ("Kashmir", "https://traveltriangle.com/tour-packages/kashmir"),
        ("Bali", "https://traveltriangle.com/tour-packages/bali"),
        ("Rajasthan", "https://traveltriangle.com/tour-packages/rajasthan"),
        ("Thailand", "https://traveltriangle.com/tour-packages/thailand"),
        ("Dubai", "https://traveltriangle.com/tour-packages/dubai"),
        ("Singapore", "https://traveltriangle.com/tour-packages/singapore"),
        ("Maldives", "https://traveltriangle.com/tour-packages/maldives"),
        ("Sri Lanka", "https://traveltriangle.com/tour-packages/sri-lanka"),
    ]
    
    all_packages = []
    
    for dest_name, dest_url in destinations:
        print(f"\nScraping {dest_name} packages...")
        packages = scrape_destination_packages(dest_url, dest_name)
        all_packages.extend(packages)
        print(f"  Found {len(packages)} packages")
    
    # Remove duplicates
    seen_urls = set()
    unique_packages = []
    for pkg in all_packages:
        if pkg['url'] not in seen_urls:
            seen_urls.add(pkg['url'])
            unique_packages.append(pkg)
    
    # Save results
    output_data = {
        "metadata": {
            "scraped_at": datetime.now().isoformat(),
            "source": "https://traveltriangle.com/",
            "scraper_version": "Quick 1.0",
            "total_packages": len(unique_packages),
            "destinations_covered": len(set(pkg['destination'] for pkg in unique_packages))
        },
        "packages": unique_packages
    }
    
    output_file = f"holiday_packages_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Generate summary
    generate_summary(unique_packages)
    
    print(f"\n✓ Scraping complete!")
    print(f"  Total packages: {len(unique_packages)}")
    print(f"  Saved to: {output_file}")
    
    return output_file

def scrape_destination_packages(dest_url, dest_name):
    """Scrape packages from a destination page"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        response = requests.get(dest_url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        packages = []
        
        # Find package links and basic info
        package_links = []
        
        # Look for package links
        for link in soup.find_all('a', href=True):
            href = link['href']
            if '/packages/' in href:
                full_url = href if href.startswith('http') else f"https://traveltriangle.com{href}"
                
                # Get surrounding text for package info
                parent = link.parent
                package_info = extract_basic_package_info(parent, full_url, dest_name)
                
                if package_info and len(package_info['name']) > 10:
                    packages.append(package_info)
                    
                    # Limit packages per destination
                    if len(packages) >= 8:
                        break
        
        return packages
        
    except Exception as e:
        print(f"  Error scraping {dest_name}: {e}")
        return []

def extract_basic_package_info(element, url, destination):
    """Extract basic package info from an element"""
    try:
        # Get text content
        text = element.get_text(strip=True) if element else ""
        
        if len(text) < 10:
            return None
        
        # Extract package name (first substantial text)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        name = lines[0] if lines else "Unknown Package"
        
        # Clean up name
        name = re.sub(r'\s+', ' ', name)
        if len(name) < 5 or len(name) > 100:
            return None
        
        # Extract price
        price_patterns = [
            r'₹\s*[\d,]+',
            r'Rs\.\s*[\d,]+',
            r'Rs\s*[\d,]+',
            r'INR\s*[\d,]+',
            r'\$\s*[\d,]+',
            r'[\d,]+\s*(?:Rs|INR|₹)',
        ]
        
        price = "N/A"
        for pattern in price_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                price = match.group().strip()
                break
        
        # Extract duration
        duration_patterns = [
            r'\d+\s*(?:days?|nights?)',
            r'\d+\s*[-–]\s*\d+\s*(?:days?|nights?)',
            r'\d+[dD]\s*(?:[-–]\s*\d+[dD])?',
            r'\d+[nN]\s*(?:[-–]\s*\d+[nN])?',
        ]
        
        duration = "N/A"
        for pattern in duration_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                duration = match.group().strip()
                break
        
        return {
            'name': name,
            'price': price,
            'duration': duration,
            'url': url,
            'destination': destination,
            'scraped_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        return None

def generate_summary(packages):
    """Generate a summary of scraped packages"""
    print(f"\n{'='*60}")
    print("HOLIDAY PACKAGES SUMMARY")
    print('='*60)
    
    # Count by destination
    from collections import Counter
    dest_counts = Counter(pkg['destination'] for pkg in packages)
    
    print("\nPACKAGES BY DESTINATION:")
    for dest, count in dest_counts.most_common():
        print(f"  {dest:<15} : {count:2d} packages")
    
    # Price statistics
    prices = []
    for pkg in packages:
        if pkg['price'] != "N/A":
            price_match = re.search(r'(\d+(?:,\d+)*)', pkg['price'])
            if price_match:
                price_num = int(price_match.group(1).replace(',', ''))
                prices.append(price_num)
    
    if prices:
        print(f"\nPRICE STATISTICS:")
        print(f"  Min price  : ₹{min(prices):,}")
        print(f"  Max price  : ₹{max(prices):,}")
        print(f"  Avg price  : ₹{sum(prices)//len(prices):,}")
        print(f"  Budget (<₹20k): {sum(1 for p in prices if p < 20000)}")
        print(f"  Mid (₹20k-50k): {sum(1 for p in prices if 20000 <= p < 50000)}")
        print(f"  Luxury (>₹50k): {sum(1 for p in prices if p >= 50000)}")
    
    # Duration statistics
    durations = []
    for pkg in packages:
        if pkg['duration'] != "N/A":
            duration_match = re.search(r'(\d+)', pkg['duration'])
            if duration_match:
                durations.append(int(duration_match.group(1)))
    
    if durations:
        print(f"\nDURATION STATISTICS:")
        print(f"  Min duration : {min(durations)} days")
        print(f"  Max duration : {max(durations)} days")
        print(f"  Avg duration : {sum(durations)//len(durations)} days")
    
    # Show top packages
    print(f"\nFEATURED PACKAGES:")
    featured_packages = packages[:5]
    for i, pkg in enumerate(featured_packages, 1):
        print(f"\n  {i}. {pkg['name']}")
        print(f"     {pkg['destination']} | {pkg['price']} | {pkg['duration']}")
        print(f"     {pkg['url']}")

def create_sample_data():
    """Create sample holiday package data for demonstration"""
    sample_packages = [
        {
            "name": "Enchanting Kerala Backwaters & Hills Tour",
            "price": "₹25,999",
            "duration": "5 days 4 nights",
            "url": "https://traveltriangle.com/packages/kerala-backwaters-hills",
            "destination": "Kerala",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Bali Paradise Beach & Temple Tour",
            "price": "₹45,999",
            "duration": "6 days 5 nights", 
            "url": "https://traveltriangle.com/packages/bali-beach-temple",
            "destination": "Bali",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Romantic Goa Beach & Nightlife Package",
            "price": "₹18,999",
            "duration": "4 days 3 nights",
            "url": "https://traveltriangle.com/packages/goa-beach-nightlife",
            "destination": "Goa",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Heavenly Kashmir Valley & Gulmarg Tour",
            "price": "₹35,999",
            "duration": "6 days 5 nights",
            "url": "https://traveltriangle.com/packages/kashmir-valley-gulmarg",
            "destination": "Kashmir",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Royal Rajasthan Heritage & Desert Safari",
            "price": "₹42,999",
            "duration": "7 days 6 nights",
            "url": "https://traveltriangle.com/packages/rajasthan-heritage-desert",
            "destination": "Rajasthan",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Exotic Thailand Bangkok & Phuket Tour",
            "price": "₹38,999",
            "duration": "5 days 4 nights",
            "url": "https://traveltriangle.com/packages/thailand-bangkok-phuket",
            "destination": "Thailand",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Luxurious Dubai Shopping & Desert Safari",
            "price": "₹52,999",
            "duration": "5 days 4 nights",
            "url": "https://traveltriangle.com/packages/dubai-shopping-desert",
            "destination": "Dubai",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Tropical Maldives Island Hopping Experience",
            "price": "₹68,999",
            "duration": "6 days 5 nights",
            "url": "https://traveltriangle.com/packages/maldives-island-hopping",
            "destination": "Maldives",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Sri Lanka Cultural & Wildlife Adventure",
            "price": "₹32,999",
            "duration": "7 days 6 nights",
            "url": "https://traveltriangle.com/packages/sri-lanka-cultural-wildlife",
            "destination": "Sri Lanka",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "name": "Singapore City & Sentosa Island Fun",
            "price": "₹48,999",
            "duration": "5 days 4 nights",
            "url": "https://traveltriangle.com/packages/singapore-city-sentosa",
            "destination": "Singapore",
            "scraped_at": datetime.now().isoformat()
        }
    ]
    
    output_data = {
        "metadata": {
            "scraped_at": datetime.now().isoformat(),
            "source": "https://traveltriangle.com/",
            "scraper_version": "Sample 1.0",
            "total_packages": len(sample_packages),
            "note": "Sample holiday package data for demonstration"
        },
        "packages": sample_packages
    }
    
    output_file = f"sample_holiday_packages_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nSample data created!")
    print(f"  Packages: {len(sample_packages)}")
    print(f"  File: {output_file}")
    
    generate_summary(sample_packages)
    
    return output_file

if __name__ == "__main__":
    print("Choose scraping option:")
    print("1. Quick scrape from live website")
    print("2. Generate sample data (faster)")
    
    try:
        choice = input("Enter choice (1 or 2): ").strip()
        if choice == "1":
            quick_scrape_packages()
        else:
            create_sample_data()
    except:
        # Default to sample data if input fails
        create_sample_data()
