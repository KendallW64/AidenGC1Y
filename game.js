const game = document.querySelector('#game');
const restart = document.querySelector('#restart');
const { decisions, endings, responses } = trialScript;
const summary = [
  'The attorneys open their cases. Set the standard the court will use to consider punishment.',
  'The attorneys disagree about whether following the law is enough to deliver justice.',
  'The prosecution argues that James deserves punishment. The defense asks what suffering would accomplish.',
  'James takes the stand to explain how losing financial support affected his choices.',
  'Henry Allen describes what the theft cost his store and his employees.',
  'The court considers whether a victim’s anger should influence the sentence.',
  'A risk assessment predicts that James may reoffend. The lawyers dispute how much weight it deserves.',
  'The prosecution cites a similar theft case that ended in six months of jail time.',
  'The court considers who can afford legal representation and the financial costs of a sentence.',
  'The court has heard the testimony. Choose one of five sentences.',
  'An incarceration report shows how losing a scholarship can extend the effects of a sentence.',
  'A warehouse rejects a qualified applicant after learning about a conviction.',
  'A probation appointment is missed because of an unexpected work shift.',
  'During a probation review, a defendant explains what motivates them to comply.',
  'A business owner has been repaid and still struggles with the harm caused by the theft.',
  'A mediator leads a voluntary meeting about harm, responsibility, and forgiveness.',
  'An unexpected work conflict tests the conditions of a suspended sentence.',
  'A viral news story puts James, Henry, and the court under public scrutiny.',
  'Student groups disagree about how James should be held accountable in public.',
  'One year later, the court reviews the consequences and asks you to reconsider what justice requires.',
];
const participants = [
  'collins carter allen', 'collins carter', 'collins carter brooks', 'james collins carter',
  'allen james howell', 'allen collins carter', 'collins carter brooks', 'collins carter brooks',
  'collins carter brooks', 'judge james allen collins carter', 'james carter brooks', 'james brooks',
  'james thornton collins', 'james collins carter brooks', 'james allen howell', 'howell james allen',
  'james thornton collins', 'james allen collins', 'james allen', 'judge james allen',
];
const philosophies = [
  ['Retributive Justice', 'Giving people the punishment they deserve', 'How far should punishment extend after someone has served their sentence?'],
  ['Consequentialist Reasoning', 'Preventing future harm and producing beneficial outcomes', 'What should the court do when good outcomes conflict with deserved punishment?'],
  ['Restorative Justice', 'Repairing harm and rebuilding relationships through accountability', 'Can restorative justice succeed when reconciliation is impossible?'],
  ['Mercy and Rehabilitation', 'Considering circumstances and encouraging personal change', 'How can the court make room for mercy while treating people fairly?'],
  ['Social Justice', 'Recognizing systemic barriers and unequal consequences', 'How should a judge address systemic unfairness while evaluating personal responsibility?'],
];
// Each letter maps to the priority expressed by that specific option.
const reasoning = ['0124', '0341', '0120', '0340', '2200', '2201', '1444', '0404', '0401', '01220',
  '0344', '1344', '0331', '1313', '0222', '0222', '0343', '1420', '1322', '01432'];
const caseSentences = { 11: 'A', 12: 'A', 13: 'B', 14: 'B', 15: 'C', 16: 'D', 17: 'E' };
const chapterNotes = {
  'THE CONSEQUENCES': 'Several months have passed. The court will review James’s case and related case studies about other sentences.',
  'THE PUBLIC JUDGES YOU': 'The trial has drawn public attention. Your decisions now reach beyond the courtroom.',
};
let index = 0;
let record = [];
let sentence;

function element(tag, text, classes) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (classes) node.className = classes;
  return node;
}

function screen(classes) {
  const page = element('section', '', classes);
  game.replaceChildren(page);
  game.focus();
  window.scrollTo(0, 0);
  return page;
}

function heading(parent, label, title) {
  parent.append(element('p', label, 'eyebrow'), element('h1', title));
}

function button(label, action, className = 'continue') {
  const node = element('button', label, className);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}

function box(parent, title, lines) {
  const panel = element('section', '', 'box');
  panel.append(element('h2', title), ...lines.map(line => element('p', line)));
  parent.append(panel);
  return panel;
}

function options(parent, title, choices, choose) {
  const panel = box(parent, title, []);
  const list = element('div', '', 'options');
  for (const choice of choices) {
    const node = button('', () => choose(choice), 'option');
    node.append(element('span', choice.letter, 'letter'), element('span', choice.text));
    list.append(node);
  }
  panel.append(list);
}

function progress(parent) {
  const wrap = element('div', '', 'progress');
  const bar = document.createElement('progress');
  bar.max = decisions.length;
  bar.value = index + 1;
  bar.setAttribute('aria-label', 'Current decision');
  wrap.append(bar, element('span', `${index + 1} / ${decisions.length}`));
  parent.append(wrap);
}

function stage(parent, keys, chapter) {
  const visual = element('div', '', 'stage');
  visual.dataset.chapter = chapter || '';
  visual.append(...keys.split(' ').map(portrait));
  parent.append(visual);
}

function home() {
  restart.hidden = true;
  const page = screen('hero');
  const copy = element('div');
  heading(copy, 'The People vs. James Miller', 'Justice: Beyond the Verdict');
  copy.append(element('p', 'You are the judge. Hear the case, decide the sentence, and see what happens after the verdict.', 'lead'),
    button('Open the case file', caseFile));
  page.append(copy);
}

function caseFile() {
  const page = screen('screen');
  heading(page, 'Case file • Theft of $2,500 in electronics', 'The People vs. James Miller');
  box(page, 'Background', [trialScript.background]);
  const characters = element('details', '', 'box');
  characters.append(element('summary', 'Meet the court'));
  const gallery = element('div', '', 'cast-grid');
  gallery.append(...Object.keys(cast).slice(0, 8).map(portrait));
  characters.append(gallery);
  page.append(characters, button('Start the trial', () => {
    restart.hidden = false;
    showTitle();
  }));
}

function showTitle() {
  const decision = decisions[index];
  const page = screen('screen');
  progress(page);
  heading(page, 'Scene ' + decision.id + ' • ' + decision.chapter, decision.title);
  stage(page, 'judge', decision.chapter);
  page.append(button('Read scene summary', showSummary));
}

function actualCase(id) {
  if (id === 16) {
    const heardHenry = record[4]?.letter === 'C' || ['A', 'B'].includes(record[5]?.letter);
    return sentence?.letter === 'D' && heardHenry;
  }
  return sentence?.letter === caseSentences[id];
}

function showSummary() {
  const decision = decisions[index];
  const page = screen('screen');
  progress(page);
  heading(page, 'Scene summary', decision.title);
  const lines = [summary[index]];
  if (decision.chapter !== decisions[index - 1]?.chapter && chapterNotes[decision.chapter]) {
    lines.unshift(chapterNotes[decision.chapter]);
  }
  if (caseSentences[decision.id]) {
    lines.push(actualCase(decision.id) ? 'This hearing follows James after sentencing.' :
      'This hearing is a case study with different participants.');
  }
  if (decision.id === 20) lines.push('Your sentence was ' + sentence.text + '.');
  box(page, 'Before the hearing', lines);
  page.append(button('Enter the hearing', showHearing));
}

const laterDialogue = {
  11: live => [
    'The student has served a jail sentence. The college revoked the scholarship, and the student can’t afford to return.',
    (live ? 'James' : 'Student') + ': “I served my sentence. I thought that meant I paid for what I did. Why am I still being punished?”',
  ],
  12: live => [
    (live ? 'James' : 'The applicant') + ' has applied for work at a warehouse. The employer finds out about the criminal record and rejects the application.',
    'The hiring manager says the company has a policy against hiring applicants with certain types of convictions.',
  ],
  13: () => [
    'The person on probation works two jobs while attending college and missed an appointment after being called into an unexpected shift.',
    'Thornton: “The appointment was mandatory. The individual knew the reporting requirements but didn’t show up.”',
    'Collins: “If the court doesn’t enforce its orders, why should anyone take them seriously?”',
  ],
  14: live => [
    (live ? 'James' : 'Defendant') + ': “I haven’t stolen anything else. But it’s not because I’ve changed. I’m just terrified of going to jail.”',
    'The court must consider whether probation is working.',
  ],
  15: live => [
    'Eight months after sentencing, the court considers an offender who has repaid the money stolen from a business.',
    (live ? 'Allen' : 'Store owner') + ': “I got the $2,500 back but I still don’t feel like justice was done.”',
  ],
  16: live => [
    live ? 'Henry agrees to attend a voluntary meeting with James.' : 'Howell leads a simulated meeting with a different offender and store owner.',
    'Howell: “This meeting isn’t about forcing anyone to forgive. It’s about understanding the harm caused, taking responsibility, and seeing if there’s anything that can help make things right.”',
    (live ? 'James' : 'Offender') + ': “I’m really sorry. I know I hurt your business. I was desperate, but that doesn’t excuse what I did.”',
    (live ? 'Henry' : 'Store owner') + ': “I hear what you’re saying, but I can’t forgive you.”',
  ],
  17: () => [
    'The defendant has followed every condition for months.',
    'The defendant misses required community service hours after picking up extra shifts at work.',
    'The prosecutor asks that the suspended sentence be enforced.',
  ],
};

function dialogue(decision) {
  if (laterDialogue[decision.id]) return laterDialogue[decision.id](actualCase(decision.id));
  if (decision.id === 18) {
    return decision.scene.map(line => line.startsWith('Depending on the sentence') ?
      (sentence.letter === 'A' ? 'The article accuses the court of being too harsh.' :
        'The article accuses the court of being too lenient.') : line);
  }
  return decision.scene;
}

function hearingStage(page, decision) {
  let keys = participants[index];
  if (caseSentences[decision.id] && !actualCase(decision.id)) {
    keys = keys.replace('james', 'applicant').replace('allen', 'owner');
  }
  stage(page, keys, decision.chapter);
}

function showHearing() {
  const decision = decisions[index];
  const page = screen('hearing');
  progress(page);
  heading(page, decision.chapter, decision.title);
  hearingStage(page, decision);
  const columns = element('div', '', 'columns');
  box(columns, 'Court dialogue', dialogue(decision));
  options(columns, 'Your decision', decision.choices, choice => {
    record.push(choice);
    if (decision.id === 10) sentence = choice;
    showReaction(choice);
  });
  page.append(columns);
}

function showReaction(choice) {
  const decision = decisions[index];
  const page = screen('hearing');
  progress(page);
  heading(page, 'Option ' + choice.letter, decision.title);
  hearingStage(page, decision);
  box(page, 'Your ruling', [choice.text]);
  function caseLine(line) {
    if (!caseSentences[decision.id] || actualCase(decision.id)) return line;
    return line.replace(/\bJames\b/g, 'the offender').replace(/\b(Henry|Allen)\b/g, 'the store owner')
      .replace(/^the /, 'The ');
  }
  box(page, 'Reaction', choice.reaction.map(caseLine));
  box(page, 'Consequence', choice.consequence.map(caseLine));
  if (choice.followUp.length) box(page, 'Follow-up dialogue', choice.followUp);
  const bonus = decision.bonus && choice.letter === 'D';
  const label = bonus ? 'Open The Birdcage' : index === decisions.length - 1 ? 'See the outcome' : 'Next scene';
  page.append(button(label, bonus ? showBirdcage : advance));
}

function showBirdcage() {
  const page = screen('screen');
  heading(page, 'Special scene', 'The Birdcage');
  stage(page, actualCase(12) ? 'james' : 'applicant');
  const bonus = decisions[index].bonus;
  const panel = box(page, 'Barriers after conviction', [bonus[0]]);
  const list = element('ul');
  list.append(...bonus.filter(line => line.startsWith('•')).map(line => element('li', line.slice(1))));
  panel.append(list, ...bonus.slice(5, 7).map(line => element('p', line)), element('blockquote', bonus[8]), element('p', bonus[9]));
  page.append(button('Next scene', advance));
}

function advance() {
  index += 1;
  if (index === decisions.length) showEnding();
  else showTitle();
}

function showEnding() {
  const ending = endings['ABCDE'.indexOf(sentence.letter)];
  const page = screen('screen');
  heading(page, 'Case outcome', ending.title);
  stage(page, 'james allen judge');
  const scenario = ending.scenario.slice();
  let narration = ending.narration;
  if (sentence.letter === 'D' && (!actualCase(16) || record[15].letter === 'A')) {
    scenario.splice(0, scenario.length, actualCase(16)
      ? 'The meeting ended after Henry felt pressured to forgive James.'
      : 'Henry chose to stay out of the voluntary meeting. James still has the opportunity to take responsibility.');
    narration = ['Henry’s participation and forgiveness are his to give. The court must consider how James can continue to make amends.', ending.narration.at(-1)];
  }
  if (sentence.letter === 'E' && record[16].letter === 'A') {
    scenario.splice(0, scenario.length, 'The court enforced the suspended sentence after James missed community service hours.');
    narration = ending.narration.slice(1);
  }
  box(page, sentence.text, [...scenario, ...narration]);
  page.append(element('blockquote', ending.question.join(' ')),
    button('See your Justice Profile', showProfile));
}

function showProfile() {
  const scores = philosophies.map((_, id) => ({ id, total: 0 }));
  record.forEach((choice, position) => {
    const id = Number(reasoning[position]['ABCDE'.indexOf(choice.letter)]);
    scores[id].total += 1;
  });
  scores.sort((first, second) => second.total - first.total);
  const [primary, secondary] = scores.map(({ id }) => philosophies[id]);
  const page = screen('screen');
  heading(page, 'Your approach to justice', 'Justice Profile');
  box(page, scores[0].total === scores[1].total ? 'Joint leading approaches' : 'Primary and secondary approaches',
    [primary[0] + ' — ' + primary[1] + '.', secondary[0] + ' — ' + secondary[1] + '.']);
  page.append(element('blockquote', primary[2]), button('Continue to final reflection', showReflection));
}

function showReflection() {
  const page = screen('screen');
  heading(page, 'After the trial', 'Final reflection');
  box(page, 'Consider your verdict', [trialScript.reflection]);
  options(page, 'Your response', responses.map((text, id) => ({ letter: 'ABCD'[id], text })), choice => {
    const end = screen('screen');
    heading(end, 'Case closed', 'The People vs. James Miller');
    box(end, 'Your final reflection', [choice.text, trialScript.closing]);
    end.append(button('Play again', reset));
  });
}

function reset() {
  index = 0;
  record = [];
  sentence = undefined;
  home();
}
restart.addEventListener('click', () => {
  if (window.confirm('Start over and clear this trial’s decisions?')) reset();
});
home();
