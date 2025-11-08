#!/usr/bin/env python3
"""
Targeted script to find and extract actual holiday packages from TravelTriangle
"""

import requests
from bs4 import BeautifulSoup
import json
import re

def find_packages_advanced(url, destination_name):
    """Advanced package extraction with multiple strategies"""
    print(f"\n{'='*60}")
    print(f"EXTRACTING PACKAGES FROM: {destination_name}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        packages = []
        
        # Strategy 1: Look for common package container patterns
        container_patterns = [
            '[class*="package"]',
            '[class*="tour"]',
            '[class*="card"]',
            '[class*="item"]',
            '[class*="deal"]',
            '[class*="offer"]',
            '[class*="trip"]',
            '[class*="holiday"]',
            'div[class*="list"] > div',
            'div[class*="grid"] > div',
            'div[class*="container"] > div',
        ]
        
        for container_sel in container_patterns:
            try:
                containers = soup.select(container_sel)
                print(f"\nTrying container selector: {container_sel} ({len(containers)} found)")
                
                for container in containers[:20]:  # Limit to first 20 for analysis
                    package_info = extract_package_info(container, url)
                    if package_info and package_info['name'] and len(package_info['name']) > 5:
                        packages.append(package_info)
                        print(f"  ✓ Found package: {package_info['name'][:50]}...")
                        
                if packages:
                    print(f"Found {len(packages)} packages with this selector")
                    break
                    
            except Exception as e:
                continue
        
        # Strategy 2: Look for links with package/tour in href
        if not packages:
            print(f"\nTrying link-based extraction...")
            link_selectors = [
                'a[href*="package"]',
                'a[href*="tour"]',
                'a[href*="holiday"]',
                'a[href*="trip"]'
            ]
            
            for link_sel in link_selectors:
                try:
                    links = soup.select(link_sel)
                    print(f"Trying link selector: {link_sel} ({len(links)} found)")
                    
                    for link in links[:30]:  # Limit for analysis
                        # Get parent container that might contain package info
                        parent = link.parent
                        for _ in range(3):  # Check up to 3 levels up
                            if parent and len(parent.get_text(strip=True)) > 50:
                                package_info = extract_package_info(parent, url)
                                if package_info and package_info['name']:
                                    packages.append(package_info)
                                    print(f"  ✓ Found package via link: {package_info['name'][:50]}...")
                                    break
                            parent = parent.parent if parent else None
                    
                    if packages:
                        print(f"Found {len(packages)} packages with this selector")
                        break
                        
                except Exception as e:
                    continue
        
        # Strategy 3: Look for price patterns and extract surrounding context
        if not packages:
            print(f"\nTrying price-based extraction...")
            price_pattern = re.compile(r'Rs\.\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?')
            
            for match in price_pattern.finditer(response.text):
                # Get some context around the price
                start = max(0, match.start() - 200)
                end = min(len(response.text), match.end() + 200)
                context = response.text[start:end]
                
                # Parse this context as HTML to extract structured info
                try:
                    context_soup = BeautifulSoup(f"<div>{context}</div>", 'lxml')
                    package_info = extract_package_info(context_soup, url)
                    if package_info and package_info['name'] and len(package_info['name']) > 5:
                        packages.append(package_info)
                        print(f"  ✓ Found package via price: {package_info['name'][:50]}...")
                except:
                    continue
                
                if len(packages) >= 10:  # Limit to avoid duplicates
                    break
        
        # Remove duplicates
        seen_names = set()
        unique_packages = []
        for pkg in packages:
            name_key = pkg['name'].lower().strip()
            if name_key not in seen_names:
                seen_names.add(name_key)
                unique_packages.append(pkg)
        
        print(f"\nFinal result: {len(unique_packages)} unique packages found")
        
        # Show sample packages
        for i, pkg in enumerate(unique_packages[:5]):
            print(f"\nPackage {i+1}:")
            print(f"  Name: {pkg['name']}")
            print(f"  Price: {pkg['price']}")
            print(f"  Duration: {pkg['duration']}")
            print(f"  URL: {pkg['url']}")
        
        return unique_packages
        
    except Exception as e:
        print(f"Error extracting packages: {e}")
        return []

def extract_package_info(element, base_url):
    """Extract package information from a container element"""
    try:
        # Find name/title
        name_selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            '[class*="title"]',
            '[class*="name"]',
            'a[href]',
            '.package-title',
            '.tour-title'
        ]
        
        name = None
        for sel in name_selectors:
            name_elem = element.select_one(sel)
            if name_elem:
                name = name_elem.get_text(strip=True)
                if name and len(name) > 5 and len(name) < 200:
                    break
        
        if not name:
            return None
        
        # Find price
        price_selectors = [
            '[class*="price"]',
            '[class*="cost"]',
            '[class*="amount"]',
            '[class*="fare"]'
        ]
        
        price = "N/A"
        for sel in price_selectors:
            price_elem = element.select_one(sel)
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                if price_text and ('Rs.' in price_text or '₹' in price_text or '$' in price_text or price_text.isdigit()):
                    price = price_text
                    break
        
        # If no price in specific elements, look in entire text
        if price == "N/A":
            text = element.get_text()
            price_match = re.search(r'Rs\.\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?', text)
            if price_match:
                price = price_match.group()
        
        # Find duration
        duration_selectors = [
            '[class*="duration"]',
            '[class*="days"]',
            '[class*="nights"]',
            '[class*="time"]'
        ]
        
        duration = "N/A"
        for sel in duration_selectors:
            dur_elem = element.select_one(sel)
            if dur_elem:
                duration_text = dur_elem.get_text(strip=True)
                if duration_text and re.search(r'\d+\s*(?:days?|nights?)', duration_text):
                    duration = duration_text
                    break
        
        # If no duration in specific elements, look in entire text
        if duration == "N/A":
            text = element.get_text()
            dur_match = re.search(r'\d+\s*(?:days?|nights?)', text)
            if dur_match:
                duration = dur_match.group()
        
        # Find URL
        link = element.select_one('a[href]')
        url = link['href'] if link else base_url
        if url.startswith('/'):
            url = f"https://traveltriangle.com{url}"
        
        return {
            'name': name,
            'price': price,
            'duration': duration,
            'url': url,
            'source_url': base_url
        }
        
    except Exception as e:
        return None

def main():
    """Main extraction function"""
    print("TRAVELTRIANGLE PACKAGE EXTRACTOR")
    print("=" * 80)
    
    # Test destinations
    test_destinations = [
        ("Kerala", "https://traveltriangle.com/tour-packages/kerala"),
        ("Goa", "https://traveltriangle.com/tour-packages/goa"),
        ("Kashmir", "https://traveltriangle.com/tour-packages/kashmir"),
        ("Bali", "https://traveltriangle.com/tour-packages/bali"),
        ("Rajasthan", "https://traveltriangle.com/tour-packages/rajasthan"),
    ]
    
    all_packages = []
    
    for dest_name, url in test_destinations:
        try:
            packages = find_packages_advanced(url, dest_name)
            for pkg in packages:
                pkg['destination'] = dest_name
                all_packages.append(pkg)
        except Exception as e:
            print(f"Failed to extract from {dest_name}: {e}")
    
    # Save results
    output_data = {
        "metadata": {
            "scraped_at": "2025-11-07T01:45:00.000000",
            "source": "https://traveltriangle.com/",
            "total_packages": len(all_packages)
        },
        "packages": all_packages
    }
    
    with open("extracted_packages.json", 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*80}")
    print("EXTRACTION COMPLETE")
    print("="*80)
    print(f"Total packages found: {len(all_packages)}")
    print("Results saved to: extracted_packages.json")
    
    # Show summary by destination
    from collections import Counter
    dest_counts = Counter(pkg['destination'] for pkg in all_packages)
    print(f"\nPackages by destination:")
    for dest, count in dest_counts.most_common():
        print(f"  {dest}: {count} packages")

if __name__ == "__main__":
    main()
