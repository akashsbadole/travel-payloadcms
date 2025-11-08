#!/usr/bin/env python3
"""
Simple script to inspect TravelTriangle website structure
and find the correct CSS selectors for package extraction
"""

import requests
from bs4 import BeautifulSoup
import json

def inspect_page(url, name):
    """Inspect a page and find potential package elements"""
    print(f"\n{'='*60}")
    print(f"INSPECTING: {name}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Look for common package-related elements
        potential_selectors = [
            # Common package card selectors
            '[class*="package"]',
            '[class*="tour"]', 
            '[class*="holiday"]',
            '[class*="card"]',
            '[class*="item"]',
            '[class*="deal"]',
            '[class*="offer"]',
            
            # Specific to travel sites
            '[class*="trip"]',
            '[class*="vacation"]',
            '[class*="booking"]',
            
            # Generic containers
            'div[class*="list"]',
            'div[class*="grid"]',
            'div[class*="container"]',
            
            # Link elements
            'a[href*="package"]',
            'a[href*="tour"]',
        ]
        
        found_elements = {}
        
        for selector in potential_selectors:
            try:
                elements = soup.select(selector)
                if elements:
                    found_elements[selector] = len(elements)
                    print(f"✓ Found {len(elements)} elements with selector: {selector}")
                    
                    # Show first few elements as examples
                    for i, elem in enumerate(elements[:3]):
                        print(f"  Example {i+1}: {elem.name} with class='{elem.get('class', [])}'")
                        
                        # Look for text content that might be package info
                        text = elem.get_text(strip=True)
                        if text and len(text) > 10:
                            preview = text[:100] + "..." if len(text) > 100 else text
                            print(f"    Text preview: {preview}")
            except Exception as e:
                continue
        
        # Look for price patterns
        print(f"\n{'-'*40}")
        print("LOOKING FOR PRICE PATTERNS:")
        print(f"{'-'*40}")
        
        price_patterns = [
            r'₹\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'Rs\.\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?',
            r'\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:Rs|INR|₹)',
        ]
        
        import re
        for pattern in price_patterns:
            matches = re.findall(pattern, response.text)
            if matches:
                print(f"Found {len(matches)} prices with pattern: {pattern}")
                for match in matches[:3]:
                    print(f"  Price: {match}")
        
        # Look for duration patterns
        print(f"\n{'-'*40}")
        print("LOOKING FOR DURATION PATTERNS:")
        print(f"{'-'*40}")
        
        duration_patterns = [
            r'\d+\s*(?:days?|nights?)',
            r'\d+\s*[ndND]',
            r'\d+\s*[-–]\s*\d+\s*(?:days?|nights?)',
        ]
        
        for pattern in duration_patterns:
            matches = re.findall(pattern, response.text)
            if matches:
                print(f"Found {len(matches)} durations with pattern: {pattern}")
                for match in matches[:3]:
                    print(f"  Duration: {match}")
        
        # Save page content for manual inspection
        output_file = f"inspection_{name.lower().replace(' ', '_')}.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"\nPage saved to: {output_file}")
        
        return found_elements
        
    except Exception as e:
        print(f"Error inspecting {url}: {e}")
        return {}

def main():
    """Main inspection function"""
    print("TRAVELTRIANGLE WEBSITE INSPECTOR")
    print("=" * 80)
    
    # Test pages to inspect
    test_urls = [
        ("Homepage", "https://traveltriangle.com/"),
        ("Kashmir Packages", "https://traveltriangle.com/tour-packages/kashmir"),
        ("Kerala Packages", "https://traveltriangle.com/tour-packages/kerala"),
        ("Goa Packages", "https://traveltriangle.com/tour-packages/goa"),
        ("Bali Packages", "https://traveltriangle.com/tour-packages/bali"),
    ]
    
    all_results = {}
    
    for name, url in test_urls:
        try:
            results = inspect_page(url, name)
            all_results[name] = results
        except Exception as e:
            print(f"Failed to inspect {name}: {e}")
            all_results[name] = {"error": str(e)}
    
    # Save summary
    with open("inspection_summary.json", 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*80}")
    print("INSPECTION COMPLETE")
    print("="*80)
    print("Summary saved to: inspection_summary.json")
    print("HTML files saved for manual inspection")
    
    # Provide recommendations
    print(f"\n{'='*80}")
    print("RECOMMENDATIONS:")
    print("="*80)
    
    for page_name, results in all_results.items():
        if "error" in results:
            continue
            
        if results:
            best_selector = max(results.items(), key=lambda x: x[1])
            print(f"\n{page_name}:")
            print(f"  Best selector: {best_selector[0]} ({best_selector[1]} elements)")
        else:
            print(f"\n{page_name}: No package elements found")

if __name__ == "__main__":
    main()
