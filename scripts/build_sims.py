#!/usr/bin/env python3
"""
Generates pages/simulations/{slug}.html for each simulation.
Run: python scripts/build_sims.py
"""

import os
import re
import json

ROOT    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'pages', 'simulations')

os.makedirs(OUT_DIR, exist_ok=True)

SIMULATIONS = [
    { 'script': 'black_hole',          'title': 'Black Hole Gravitational Lensing',    'description': 'Explore Schwarzschild spacetime with real-time ray tracing and accretion disk physics.', 'topic': 'astro',     'image': '../images/black_hole.jpg' },
    { 'script': 'Reflection_Refraction','title': 'Reflection and Refraction',           'description': 'Change your incident angle and see the results.',                                          'topic': 'astro',     'image': '/images/reflrefr.jpg' },
    { 'script': 'newtons_first_law',    'title': "Newton's First Law",                  'description': 'Law of Inertia — objects remain at rest or in uniform motion unless acted upon by a force.', 'topic': 'mechanics', 'image': '/images/newtons_first.jpg' },
    { 'script': 'newtons_second_law',   'title': "Newton's Second Law",                 'description': 'Force equals mass times acceleration. Visualize how force, mass, and acceleration relate.', 'topic': 'mechanics', 'image': '/images/newtons_second.jpg' },
    { 'script': 'newtons_third_law',    'title': "Newton's Third Law",                  'description': 'For every action there is an equal and opposite reaction.',                                 'topic': 'mechanics', 'image': '/images/newtons_third.jpg' },
    { 'script': 'momentum_collisions',  'title': 'Momentum and Collisions',             'description': 'Explore elastic and inelastic collisions. See momentum conservation in action.',            'topic': 'mechanics', 'image': '/images/momentum_collision.jpg' },
    { 'script': 'energy_conservation',  'title': 'Energy Conservation',                 'description': 'Watch potential energy transform into kinetic energy.',                                      'topic': 'mechanics', 'image': '/images/energy_conservation.jpg' },
    { 'script': 'friction',             'title': 'Friction Forces',                     'description': 'Understand static and kinetic friction with different surfaces and inclined planes.',        'topic': 'mechanics', 'image': '/images/friction.jpg' },
    { 'script': 'pendulum',             'title': 'Pendulum Motion',                     'description': 'Simple harmonic motion and energy transfer in a pendulum.',                                 'topic': 'ocw',       'image': '/images/pendulum.jpg' },
    { 'script': 'faradays_law',         'title': "Faraday's Law",                       'description': 'A changing magnetic field induces current in a coil.',                                      'topic': 'em',        'image': '/images/faradays.jpg' },
    { 'script': 'newtonian_gravity',    'title': "Newton's Law of Gravitation",         'description': 'The fundamental law of gravitational attraction.',                                          'topic': 'astro',     'image': '/images/newtonian_gravity.jpg' },
    { 'script': 'hookes_law',           'title': "Hooke's Law",                         'description': 'See a spring oscillate.',                                                                   'topic': 'ocw',       'image': '/images/hookes.jpg' },
    { 'script': 'keplers_second_law',   'title': "Kepler's Second Law",                 'description': "Kepler's Law of Planetary Motion.",                                                        'topic': 'astro',     'image': '/images/keplers_second.jpg' },
    { 'script': 'resistors',            'title': 'Resistors in Series and Parallel',    'description': 'See how resistors compound in different circuit configurations.',                            'topic': 'em',        'image': '/images/resistors.jpg' },
    { 'script': 'capacitors',           'title': 'Capacitors in Series and Parallel',   'description': 'See how capacitors compound in different circuit configurations.',                           'topic': 'em',        'image': '/images/capacitors.jpg' },
    { 'script': 'gauss_law',            'title': "Gauss' Law",                          'description': "Gauss' Law.",                                                                               'topic': 'em',        'image': '/images/gauss.jpg' },
    { 'script': 'coulombs_law',         'title': "Coulomb's Law",                       'description': "Coulomb's Law.",                                                                            'topic': 'em',        'image': '/images/coulomb.jpg' },
]


def make_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    return slug


def build_page(sim, slug):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{sim['title']}</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <nav>
        <a href="/index.html">Home</a>
        <a href="/pages/sims.html">Simulations</a>
        <a href="/pages/videos.html">Videos</a>
        <a href="/pages/about.html">About</a>
    </nav>

    <div id="simulation-container"></div>

    <script src="/scripts/{sim['script']}.js"></script>

    <stage-footer>
        <div class="footer-content">
            <p>Created by Adam Field</p>
            <div class="footer-socials">
                <span class="contact-label">Contact me:</span>
                <div class="social-icons">
                    <a href="mailto:adfield@wpi.edu" title="Email">
                        <img src="/images/email_logo.svg" alt="email logo">
                    </a>
                    <a href="https://www.linkedin.com/in/adfield/" target="_blank" title="LinkedIn">
                        <img src="/images/linkedin_logo.svg" alt="linkedin logo">
                    </a>
                    <a href="https://github.com/AdamField118" target="_blank" title="GitHub">
                        <img src="/images/github_logo.svg" alt="github logo">
                    </a>
                </div>
            </div>
        </div>
    </stage-footer>
</body>
</html>'''


index = []

for sim in SIMULATIONS:
    slug = make_slug(sim['title'])
    href = f'/pages/simulations/{slug}.html'

    html = build_page(sim, slug)
    out_path = os.path.join(OUT_DIR, f'{slug}.html')
    open(out_path, 'w', encoding='utf8').write(html)
    print(f'  built {slug}.html')

    index.append({
        'title':       sim['title'],
        'description': sim['description'],
        'topic':       sim['topic'],
        'image':       sim['image'],
        'href':        href
    })

open(os.path.join(ROOT, 'simulations.json'), 'w', encoding='utf8').write(
    json.dumps(index, indent=2)
)
print(f'  wrote simulations.json ({len(index)} sims)')