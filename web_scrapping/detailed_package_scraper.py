#!/usr/bin/env python3
"""
Enhanced scraper that visits individual package pages to extract complete details
including price, duration, inclusions, highlights, ratings, and more
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime
import sys

# Set stdout to UTF-8 for Windows compatibility
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def scrape_package_details(package_url, destination_name):
    """Scrape comprehensive details from an individual package page"""
    print(f"\n{'='*60}")
    print(f"SCRAPING PACKAGE DETAILS")
    print(f"Destination: {destination_name}")
    print(f"URL: {package_url}")
    print(f"{'='*60}")
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }
        
        response = requests.get(package_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Extract comprehensive package information
        package_details = {
            'name': extract_package_name(soup),
            'price': extract_price(soup),
            'duration': extract_duration(soup),
            'inclusions': extract_inclusions(soup),
            'highlights': extract_highlights(soup),
            'itinerary': extract_itinerary(soup),
            'rating': extract_rating(soup),
            'reviews_count': extract_reviews_count(soup),
            'accommodation': extract_accommodation(soup),
            'transport': extract_transport(soup),
            'meals': extract_meals(soup),
            'activities': extract_activities(soup),
            'best_time': extract_best_time(soup),
            'difficulty': extract_difficulty(soup),
            'group_size': extract_group_size(soup),
            'destination': destination_name,
            'url': package_url,
            'scraped_at': datetime.now().isoformat()
        }
        
        # Print extracted details
        print(f"Package Name: {package_details['name']}")
        print(f"Price: {package_details['price']}")
        print(f"Duration: {package_details['duration']}")
        print(f"Rating: {package_details['rating']}")
        print(f"Reviews: {package_details['reviews_count']}")
        print(f"Inclusions: {package_details['inclusions'][:100]}...")
        print(f"Highlights: {package_details['highlights'][:100]}...")
        print(f"Accommodation: {package_details['accommodation']}")
        print(f"Transport: {package_details['transport']}")
        print(f"Meals: {package_details['meals']}")
        print(f"Activities: {package_details['activities'][:100]}...")
        
        return package_details
        
    except Exception as e:
        print(f"Error scraping package: {e}")
        return {
            'name': f"{destination_name} Package",
            'price': "N/A",
            'duration': "N/A",
            'inclusions': "N/A",
            'highlights': "N/A",
            'itinerary': "N/A",
            'rating': None,
            'reviews_count': None,
            'accommodation': "N/A",
            'transport': "N/A",
            'meals': "N/A",
            'activities': "N/A",
            'best_time': "N/A",
            'difficulty': "N/A",
            'group_size': "N/A",
            'destination': destination_name,
            'url': package_url,
            'scraped_at': datetime.now().isoformat(),
            'error': str(e)
        }

def extract_package_name(soup):
    """Extract package name"""
    selectors = [
        'h1',
        'h2',
        '[class*="title"]',
        '[class*="package-title"]',
        '[class*="tour-title"]',
        '.page-title',
        '.package-name',
        'title'
    ]
    
    for selector in selectors:
        element = soup.select_one(selector)
        if element:
            name = element.get_text(strip=True)
            if name and len(name) > 5 and len(name) < 200:
                return name
    
    return "Unknown Package"

def extract_price(soup):
    """Extract package price"""
    # Multiple price patterns to try
    price_patterns = [
        r'₹\s*[\d,]+(?:\.\d{2})?',
        r'Rs\.\s*[\d,]+(?:\.\d{2})?',
        r'Rs\s*[\d,]+(?:\.\d{2})?',
        r'INR\s*[\d,]+(?:\.\d{2})?',
        r'\$\s*[\d,]+(?:\.\d{2})?',
        r'Price[:\s]*₹\s*[\d,]+',
        r'Starting from[:\s]*₹\s*[\d,]+',
        r'Cost[:\s]*₹\s*[\d,]+',
        r'Total[:\s]*₹\s*[\d,]+',
        r'Per person[:\s]*₹\s*[\d,]+',
    ]
    
    text_content = soup.get_text()
    
    for pattern in price_patterns:
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            for match in matches:
                # Clean and validate price
                clean_price = re.sub(r'[^\d,]', '', match)
                if clean_price and len(clean_price) > 2:
                    # Convert to standard format
                    if '₹' in match or 'Rs' in match or 'INR' in match:
                        return f"₹{clean_price}"
                    else:
                        return f"${clean_price}"
    
    return "N/A"

def extract_duration(soup):
    """Extract package duration"""
    duration_patterns = [
        r'(\d+)\s*(?:days?|nights?)\s*(?:[-–]\s*(\d+)\s*(?:days?|nights?))?',
        r'(\d+)\s*[dD]\s*(?:[-–]\s*(\d+)\s*[dD])?',
        r'(\d+)\s*[nN]\s*(?:[-–]\s*(\d+)\s*[nN])?',
        r'Duration[:\s]*(\d+)\s*(?:days?|nights?)',
        r'Trip[:\s]*(\d+)\s*(?:days?|nights?)',
        r'Package[:\s]*(\d+)\s*(?:days?|nights?)',
        r'(\d+)\s*[-–]\s*\d+\s*(?:days?|nights?)',
    ]
    
    text_content = soup.get_text()
    
    for pattern in duration_patterns:
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            match = matches[0]
            if isinstance(match, tuple):
                if len(match) == 2 and match[1]:
                    return f"{match[0]}-{match[1]} days"
                else:
                    return f"{match[0]} days"
            else:
                return f"{match} days"
    
    return "N/A"

def extract_inclusions(soup):
    """Extract package inclusions"""
    selectors = [
        '[class*="inclusion"]',
        '[class*="include"]',
        '[class*="facility"]',
        '[class*="amenity"]',
        '.inclusions',
        '.includes',
        '.what-includes',
        '.package-inclusions'
    ]
    
    inclusions_text = ""
    for selector in selectors:
        elements = soup.select(selector)
        if elements:
            inclusions_text = ' '.join([elem.get_text(strip=True) for elem in elements])
            if inclusions_text and len(inclusions_text) > 20:
                break
    
    # If no structured inclusions found, look for inclusion keywords
    if not inclusions_text or len(inclusions_text) < 20:
        inclusion_keywords = [
            'includes', 'included', 'accommodation', 'transport', 'meals',
            'sightseeing', 'guide', 'entrance', 'transfer', 'hotel', 'flight',
            'breakfast', 'lunch', 'dinner', 'pickup', 'drop', 'airfare'
        ]
        
        lines = soup.get_text().split('\n')
        inclusions = []
        for line in lines:
            if any(keyword.lower() in line.lower() for keyword in inclusion_keywords):
                clean_line = line.strip()
                if clean_line and 10 < len(clean_line) < 200:
                    inclusions.append(clean_line)
        
        inclusions_text = ' | '.join(inclusions[:8])
    
    return inclusions_text[:500] if inclusions_text else "N/A"

def extract_highlights(soup):
    """Extract package highlights"""
    selectors = [
        '[class*="highlight"]',
        '[class*="feature"]',
        '[class*="attraction"]',
        '[class*="activity"]',
        '.highlights',
        '.features',
        '.activities',
        '.key-points',
        '.package-highlights'
    ]
    
    highlights_text = ""
    for selector in selectors:
        elements = soup.select(selector)
        if elements:
            highlights_text = ' '.join([elem.get_text(strip=True) for elem in elements])
            if highlights_text and len(highlights_text) > 20:
                break
    
    return highlights_text[:500] if highlights_text else "N/A"

def extract_itinerary(soup):
    """Extract package itinerary"""
    selectors = [
        '[class*="itinerary"]',
        '[class*="schedule"]',
        '[class*="day-plan"]',
        '.itinerary',
        '.schedule',
        '.day-wise-plan'
    ]
    
    itinerary_text = ""
    for selector in selectors:
        elements = soup.select(selector)
        if elements:
            itinerary_text = ' '.join([elem.get_text(strip=True) for elem in elements])
            if itinerary_text and len(itinerary_text) > 30:
                break
    
    return itinerary_text[:800] if itinerary_text else "N/A"

def extract_rating(soup):
    """Extract package rating"""
    rating_patterns = [
        r'(\d+\.?\d*)\s*[\/]?5',
        r'(\d+\.?\d*)\s*stars?',
        r'Rating[:\s]*(\d+\.?\d*)',
        r'Score[:\s]*(\d+\.?\d*)',
        r'(\d+\.?\d*)\s*out of 5',
    ]
    
    text_content = soup.get_text()
    
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

def extract_reviews_count(soup):
    """Extract number of reviews"""
    review_patterns = [
        r'(\d+)\s*(?:reviews?|ratings?)',
        r'(\d+)\s*(?:people reviewed)',
        r'Reviews?\s*\((\d+)\)',
        r'(\d+)\s*reviews',
    ]
    
    text_content = soup.get_text()
    
    for pattern in review_patterns:
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            try:
                return int(matches[0])
            except:
                continue
    
    return None

def extract_accommodation(soup):
    """Extract accommodation details"""
    accommodation_keywords = ['hotel', 'resort', 'stay', 'accommodation', 'room']
    text_content = soup.get_text()
    
    for keyword in accommodation_keywords:
        pattern = rf'{keyword}[:\s]*([^.]+)'
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            return matches[0].strip()[:100]
    
    return "N/A"

def extract_transport(soup):
    """Extract transport details"""
    transport_keywords = ['flight', 'cab', 'bus', 'train', 'transport', 'transfer']
    text_content = soup.get_text()
    
    transport_types = []
    for keyword in transport_keywords:
        if keyword.lower() in text_content.lower():
            transport_types.append(keyword.title())
    
    return ', '.join(transport_types) if transport_types else "N/A"

def extract_meals(soup):
    """Extract meal details"""
    meal_keywords = ['breakfast', 'lunch', 'dinner', 'meals', 'food', 'dining']
    text_content = soup.get_text()
    
    meal_types = []
    for keyword in meal_keywords:
        if keyword.lower() in text_content.lower():
            meal_types.append(keyword.title())
    
    return ', '.join(meal_types) if meal_types else "N/A"

def extract_activities(soup):
    """Extract activity details"""
    activity_keywords = [
        'sightseeing', 'swimming', 'trekking', 'shopping', 'cruise',
        'safari', 'temple visit', 'beach', 'water sports', 'snorkeling',
        'scuba diving', 'city tour', 'museum', 'park', 'adventure'
    ]
    text_content = soup.get_text()
    
    activities = []
    for keyword in activity_keywords:
        if keyword.lower() in text_content.lower():
            activities.append(keyword.title())
    
    return ', '.join(activities) if activities else "N/A"

def extract_best_time(soup):
    """Extract best time to visit"""
    time_patterns = [
        r'Best time[:\s]*([^.]+)',
        r'Ideal season[:\s]*([^.]+)',
        r'Best season[:\s]*([^.]+)',
        r'When to visit[:\s]*([^.]+)',
    ]
    
    text_content = soup.get_text()
    
    for pattern in time_patterns:
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            return matches[0].strip()[:100]
    
    return "N/A"

def extract_difficulty(soup):
    """Extract difficulty level"""
    difficulty_keywords = ['easy', 'moderate', 'difficult', 'adventure', 'relaxed']
    text_content = soup.get_text()
    
    for keyword in difficulty_keywords:
        if keyword.lower() in text_content.lower():
            return keyword.title()
    
    return "N/A"

def extract_group_size(soup):
    """Extract group size information"""
    size_patterns = [
        r'Group size[:\s]*(\d+)',
        r'Max people[:\s]*(\d+)',
        r'(\d+)\s*(?:people|persons|travelers)',
    ]
    
    text_content = soup.get_text()
    
    for pattern in size_patterns:
        matches = re.findall(pattern, text_content, re.IGNORECASE)
        if matches:
            try:
                return int(matches[0])
            except:
                continue
    
    return "N/A"

def scrape_detailed_packages():
    """Main function to scrape detailed package information"""
    print("DETAILED HOLIDAY PACKAGE SCRAPER")
    print("=" * 60)
    print("This scraper visits individual package pages to extract complete details")
    print("=" * 60)
    
    # Package URLs to scrape (from previous extraction)
    package_urls = [
        ("Kerala", "https://traveltriangle.com/packages/3night-4day-bestselling-munnar-alleppey-kerala-tour"),
        ("Goa", "https://traveltriangle.com/packages/goa-friends-tour"),
        ("Kashmir", "https://traveltriangle.com/packages/4nights-5days-kashmir-tour"),
        ("Bali", "https://traveltriangle.com/packages/bali-city-tour"),
        ("Rajasthan", "https://traveltriangle.com/packages/3nights-4days-rajasthan-vacation"),
        ("Thailand", "https://traveltriangle.com/packages/5nights-6days-bangkok-phuket-thailand-honeymoon-tour"),
        ("Dubai", "https://traveltriangle.com/packages/3nights-4days-dubai-tour"),
        ("Singapore", "https://traveltriangle.com/packages/6days-luxury-tour-to-singapore"),
        ("Maldives", "https://traveltriangle.com/packages/maldives-island-hopping"),
        ("Sri Lanka", "https://traveltriangle.com/packages/sri-lanka-cultural-wildlife"),
    ]
    
    all_detailed_packages = []
    
    for i, (dest_name, package_url) in enumerate(package_urls, 1):
        print(f"\nProcessing package {i}/{len(package_urls)}: {dest_name}")
        
        package_details = scrape_package_details(package_url, dest_name)
        all_detailed_packages.append(package_details)
        
        # Respectful delay between requests
        time.sleep(3)
    
    # Save comprehensive results
    output_data = {
        "metadata": {
            "scraped_at": datetime.now().isoformat(),
            "source": "https://traveltriangle.com/",
            "scraper_version": "Detailed 2.0",
            "total_packages": len(all_detailed_packages),
            "extraction_level": "comprehensive_package_details",
            "note": "Extracted complete package information including price, duration, inclusions, highlights, ratings, and more"
        },
        "packages": all_detailed_packages
    }
    
    output_file = f"detailed_holiday_packages_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Generate summary
    generate_detailed_summary(all_detailed_packages)
    
    print(f"\n{'='*60}")
    print("DETAILED SCRAPING COMPLETE")
    print("="*60)
    print(f"Total packages: {len(all_detailed_packages)}")
    print(f"Results saved to: {output_file}")
    
    return output_file

def generate_detailed_summary(packages):
    """Generate comprehensive summary of scraped packages"""
    print(f"\n{'='*60}")
    print("COMPREHENSIVE HOLIDAY PACKAGES SUMMARY")
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
    
    # Rating statistics
    ratings = [pkg['rating'] for pkg in packages if pkg['rating'] is not None]
    if ratings:
        print(f"\nRATING STATISTICS:")
        print(f"  Avg rating : {sum(ratings)/len(ratings):.2f}/5.0")
        print(f"  Max rating : {max(ratings):.2f}/5.0")
        print(f"  Min rating : {min(ratings):.2f}/5.0")
    
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
    
    # Show top detailed packages
    print(f"\nTOP DETAILED PACKAGES:")
    for i, pkg in enumerate(packages[:5], 1):
        print(f"\n{i}. {pkg['name']}")
        print(f"   Destination: {pkg['destination']}")
        print(f"   Price: {pkg['price']}")
        print(f"   Duration: {pkg['duration']}")
        print(f"   Rating: {pkg['rating']}/5.0" if pkg['rating'] else "   Rating: N/A")
        print(f"   Reviews: {pkg['reviews_count']}")
        print(f"   Transport: {pkg['transport']}")
        print(f"   Meals: {pkg['meals']}")
        print(f"   URL: {pkg['url']}")

if __name__ == "__main__":
    scrape_detailed_packages()
