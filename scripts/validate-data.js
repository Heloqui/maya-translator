#!/usr/bin/env node

/**
 * Validates syllabary.json and dictionary.json for completeness and consistency.
 * Run: node scripts/validate-data.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function loadJSON(filename) {
  const filepath = path.join(dataDir, filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

function validateSyllabary() {
  const data = loadJSON('syllabary.json');
  const issues = [];
  const stats = { confirmed: 0, probable: 0, tentative: 0, unknown: 0, total: 0 };

  // Check vowels
  const expectedVowels = ['a', 'e', 'i', 'o', 'u'];
  const foundVowels = data.vowels.map(v => v.value);
  for (const v of expectedVowels) {
    if (!foundVowels.includes(v)) {
      issues.push(`Missing vowel: ${v}`);
    }
  }

  // Check syllabograms grid completeness
  const expectedOnsets = ['b', 'ch', "ch'", 'h', 'j', 'k', "k'", 'l', 'm', 'n', 'p', 's', 't', "t'", 'tz', "tz'", 'w', 'x', 'y'];
  const foundOnsets = data.syllabograms.map(s => s.onset);

  for (const onset of expectedOnsets) {
    if (!foundOnsets.includes(onset)) {
      issues.push(`Missing onset consonant: ${onset}`);
      continue;
    }
    const group = data.syllabograms.find(s => s.onset === onset);
    for (const vowel of expectedVowels) {
      const expected = `${onset}${vowel}`;
      const found = group.syllables.find(s => s.value === expected);
      if (!found) {
        issues.push(`Missing syllable: ${expected}`);
      } else {
        stats[found.confidence]++;
        stats.total++;

        // Check Thompson numbers format
        for (const t of found.thompson) {
          if (!/^T\d+[a-z]?$/.test(t)) {
            issues.push(`Invalid Thompson number format: ${t} for ${expected}`);
          }
        }
      }
    }
  }

  // Add vowel stats
  for (const v of data.vowels) {
    stats[v.confidence]++;
    stats.total++;
  }

  return { issues, stats, name: 'syllabary.json' };
}

function validateDictionary() {
  const data = loadJSON('dictionary.json');
  const issues = [];
  const stats = { confirmed: 0, probable: 0, tentative: 0, total: 0 };

  const sections = [
    'titles_and_ranks', 'verbs', 'nouns',
    'adjectives_and_colors', 'directional_terms',
    'death_expressions', 'war_expressions'
  ];

  for (const section of sections) {
    if (!data[section]) {
      issues.push(`Missing section: ${section}`);
      continue;
    }
    for (const entry of data[section]) {
      if (!entry.maya) issues.push(`Missing 'maya' field in ${section}`);
      if (!entry.spanish && !entry.meaning) issues.push(`Missing translation for ${entry.maya} in ${section}`);
      if (entry.confidence) {
        stats[entry.confidence] = (stats[entry.confidence] || 0) + 1;
      }
      stats.total++;
    }
  }

  // Validate numerals
  if (data.numerals) {
    for (let i = 0; i <= 19; i++) {
      const found = data.numerals.find(n => n.value === i);
      if (!found) issues.push(`Missing numeral: ${i}`);
    }
  } else {
    issues.push('Missing numerals section');
  }

  return { issues, stats, name: 'dictionary.json' };
}

// Run validations
console.log('=== Maya Translator Data Validation ===\n');

const results = [validateSyllabary(), validateDictionary()];

for (const result of results) {
  console.log(`--- ${result.name} ---`);

  if (result.issues.length === 0) {
    console.log('  OK: No issues found');
  } else {
    console.log(`  ISSUES (${result.issues.length}):`);
    for (const issue of result.issues) {
      console.log(`    - ${issue}`);
    }
  }

  console.log(`  STATS:`);
  for (const [key, val] of Object.entries(result.stats)) {
    console.log(`    ${key}: ${val}`);
  }
  console.log();
}

const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
if (totalIssues > 0) {
  console.log(`Total issues: ${totalIssues}`);
  process.exit(1);
} else {
  console.log('All validations passed.');
}
