import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import re

class travelAnalyzer:
    def __init__(self):
        self.base_url = "https://www.travel.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def get_page_content(self, url):
        """Get page content with error handling"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def analyze_homepage(self):
        """Analyze travel homepage structure"""
        print("Analyzing travel homepage...")
        
        content = self.get_page_content(self.base_url)
        if not content:
            return None
            
        soup = BeautifulSoup(content, 'html.parser')
        
        analysis = {
            'url': self.base_url,
            'title': soup.find('title').get_text() if soup.find('title') else '',
            'meta_description': '',
            'navigation': [],
            'hero_section': {},
            'search_forms': [],
            'color_scheme': {},
            'typography': {},
            'layout_components': [],
            'featured_sections': []
        }
        
        # Extract meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            analysis['meta_description'] = meta_desc.get('content', '')
        
        # Analyze navigation
        nav = soup.find('nav') or soup.find('ul', class_=re.compile(r'.*nav.*', re.I))
        if nav:
            nav_items = []
            for link in nav.find_all('a', href=True):
                text = link.get_text(strip=True)
                href = link.get('href')
                if text and href:
                    nav_items.append({
                        'text': text,
                        'href': href,
                        'class': link.get('class', [])
                    })
            analysis['navigation'] = nav_items
        
        # Analyze hero section
        hero_sections = soup.find_all(['section', 'div'], class_=re.compile(r'.*hero.*|.*banner.*|.*header.*', re.I))
        if hero_sections:
            hero = hero_sections[0]
            analysis['hero_section'] = {
                'tag': hero.name,
                'classes': hero.get('class', []),
                'background_image': '',
                'heading': '',
                'subheading': ''
            }
            
            # Extract background image
            bg_style = hero.get('style', '')
            if 'background-image' in bg_style:
                img_match = re.search(r'url\(["\']?(.*?)["\']?\)', bg_style)
                if img_match:
                    analysis['hero_section']['background_image'] = img_match.group(1)
            
            # Extract headings
            h1 = hero.find('h1')
            if h1:
                analysis['hero_section']['heading'] = h1.get_text(strip=True)
            
            h2 = hero.find('h2')
            if h2:
                analysis['hero_section']['subheading'] = h2.get_text(strip=True)
        
        # Analyze search forms
        forms = soup.find_all('form')
        for form in forms:
            form_analysis = {
                'action': form.get('action', ''),
                'method': form.get('method', 'GET'),
                'classes': form.get('class', []),
                'inputs': [],
                'buttons': []
            }
            
            # Extract inputs
            inputs = form.find_all(['input', 'select', 'textarea'])
            for inp in inputs:
                input_data = {
                    'type': inp.get('type', inp.name),
                    'name': inp.get('name', ''),
                    'placeholder': inp.get('placeholder', ''),
                    'class': inp.get('class', []),
                    'required': inp.has_attr('required')
                }
                form_analysis['inputs'].append(input_data)
            
            # Extract buttons
            buttons = form.find_all(['button', 'input[type="submit"]'])
            for btn in buttons:
                btn_data = {
                    'type': btn.get('type', 'button'),
                    'text': btn.get_text(strip=True) or btn.get('value', ''),
                    'class': btn.get('class', [])
                }
                form_analysis['buttons'].append(btn_data)
            
            if form_analysis['inputs'] or form_analysis['buttons']:
                analysis['search_forms'].append(form_analysis)
        
        # Extract color scheme from CSS
        styles = soup.find_all('style')
        colors_found = set()
        
        for style in styles:
            if style.string:
                # Find hex colors
                hex_colors = re.findall(r'#[0-9a-fA-F]{3,6}', style.string)
                colors_found.update(hex_colors)
                
                # Find rgb colors
                rgb_colors = re.findall(r'rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)', style.string)
                colors_found.update(rgb_colors)
        
        analysis['color_scheme'] = {
            'primary_colors': list(colors_found)[:10],  # Limit to first 10 colors
            'total_colors_found': len(colors_found)
        }
        
        # Analyze typography
        analysis['typography'] = {
            'headings': {},
            'body_text': {}
        }
        
        # Extract font sizes from inline styles
        font_sizes = []
        for element in soup.find_all(style=True):
            style = element.get('style', '')
            font_size_match = re.search(r'font-size:\s*([^;]+)', style)
            if font_size_match:
                font_sizes.append(font_size_match.group(1))
        
        analysis['typography']['font_sizes_found'] = font_sizes[:5]
        
        # Identify layout components
        components = soup.find_all(['section', 'div'], class_=re.compile(r'.*card.*|.*grid.*|.*flex.*|.*container.*', re.I))
        for comp in components[:5]:  # Limit to first 5 components
            analysis['layout_components'].append({
                'tag': comp.name,
                'classes': comp.get('class', []),
                'id': comp.get('id', '')
            })
        
        # Find featured sections
        featured = soup.find_all(['section', 'div'], class_=re.compile(r'.*feature.*|.*popular.*|.*trending.*|.*deal.*', re.I))
        for feat in featured[:3]:  # Limit to first 3 sections
            analysis['featured_sections'].append({
                'tag': feat.name,
                'classes': feat.get('class', []),
                'heading': feat.find(['h1', 'h2', 'h3']).get_text(strip=True) if feat.find(['h1', 'h2', 'h3']) else ''
            })
        
        return analysis
    
    def analyze_flight_search(self):
        """Analyze flight search page"""
        print("Analyzing flight search page...")
        
        flight_url = f"{self.base_url}/flights.html"
        content = self.get_page_content(flight_url)
        
        if not content:
            return None
            
        soup = BeautifulSoup(content, 'html.parser')
        
        flight_analysis = {
            'url': flight_url,
            'title': soup.find('title').get_text() if soup.find('title') else '',
            'search_form': {},
            'trip_options': [],
            'passenger_controls': [],
            'class_options': []
        }
        
        # Find main search form
        main_form = soup.find('form') or soup.find('div', class_=re.compile(r'.*search.*', re.I))
        if main_form:
            flight_analysis['search_form'] = {
                'tag': main_form.name,
                'classes': main_form.get('class', []),
                'sections': []
            }
            
            # Analyze form sections (trip type, from/to, dates, passengers)
            sections = main_form.find_all(['div', 'section'], class_=re.compile(r'.*row.*|.*col.*|.*group.*|.*field.*', re.I))
            for section in sections[:5]:
                section_data = {
                    'classes': section.get('class', []),
                    'labels': [label.get_text(strip=True) for label in section.find_all('label')],
                    'inputs': [],
                    'selects': []
                }
                
                # Extract inputs
                inputs = section.find_all('input')
                for inp in inputs:
                    section_data['inputs'].append({
                        'type': inp.get('type', ''),
                        'name': inp.get('name', ''),
                        'placeholder': inp.get('placeholder', ''),
                        'class': inp.get('class', [])
                    })
                
                # Extract selects
                selects = section.find_all('select')
                for sel in selects:
                    section_data['selects'].append({
                        'name': sel.get('name', ''),
                        'class': sel.get('class', []),
                        'options': [opt.get_text(strip=True) for opt in sel.find_all('option')]
                    })
                
                flight_analysis['search_form']['sections'].append(section_data)
        
        return flight_analysis
    
    def save_analysis(self, data, filename):
        """Save analysis to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Analysis saved to {filename}")

def main():
    analyzer = travelAnalyzer()
    
    # Analyze homepage
    homepage_analysis = analyzer.analyze_homepage()
    if homepage_analysis:
        analyzer.save_analysis(homepage_analysis, 'travel_homepage_analysis.json')
    
    # Analyze flight search
    flight_analysis = analyzer.analyze_flight_search()
    if flight_analysis:
        analyzer.save_analysis(flight_analysis, 'travel_flight_analysis.json')
    
    print("travel analysis completed!")

if __name__ == "__main__":
    main()