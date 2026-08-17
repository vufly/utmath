# Grade 1 Math Practice App — Product & Technical Specification

**Status:** v0.1  
**Primary user:** one Grade 1 child  
**Primary device:** iPad Air 2, iPadOS 15.8.x  
**Secondary devices:** newer iPhone and Android phones/tablets  
**App type:** offline-first static PWA  
**UI language:** Vietnamese  
**Spec language:** English  
**Math scope:** numbers 0–10  
**Curriculum scope:** Modules A–F

---

# 1. Product Goal

Build a lightweight, offline-first math practice app for a Grade 1 child.

The app should not merely generate worksheet questions. It should act like a small adaptive tutor that helps the child move from:

```text
counting one by one
    ↓
recognizing quantity
    ↓
seeing number structure
    ↓
composing/decomposing numbers
    ↓
mental addition/subtraction
    ↓
missing-number reasoning
    ↓
modeling pictures/stories as equations
    ↓
systematic visual reasoning for triangle counting
```

The main current weaknesses to address are:

1. Heavy reliance on finger counting.
2. Weak mental arithmetic fluency.
3. Weak number composition/decomposition.
4. Difficulty with missing-number problems.
5. Difficulty converting pictures into equations.
6. Difficulty counting all triangles in composite figures.

The app should reward effort and growing independence, not raw speed.

---

# 2. Product Principles

## 2.1. Teach strategies, not only answers

A wrong answer should trigger a useful scaffold.

Example:

```text
7 - 3 = ?
```

Possible hint progression:

```text
S0: 7 - 3 = ?

S1: 3 and what make 7?

S2:
● ● ● | ● ● ● ●
  3   |    ?
<------ 7 ------->

S3:
Let the child remove 3 objects from a group of 7.
```

The child must still provide the final answer.

## 2.2. Concrete → structural → symbolic

Each concept should move through:

```text
visual objects
    ↓
structured representation
    ↓
symbolic equation
```

Example:

```text
● ● ●     ● ● ● ●
```

```text
    7
   / \
  3   4
```

```text
3 + 4 = 7
```

## 2.3. Do not ban finger counting

The app should make better strategies easier and more attractive until finger counting naturally declines.

## 2.4. No speed pressure

Response time is useful as a diagnostic signal but must not be shown as a countdown or used to punish the child.

## 2.5. Short sessions

A normal daily session should take about 10–12 minutes and contain roughly 15–20 interactions.

## 2.6. Local-first

The child must be able to use the app fully without a network connection.

---

# 3. Users and Modes

There is one child profile in v1.

The app has two modes.

## 3.1. Child Mode

Main entry points:

```text
Today's Practice
Free Practice
Stars / streak
```

### Today's Practice

Primary action.

The app automatically builds a short adaptive session based on:

- current learning targets;
- weak skills;
- review needs;
- recent attempts;
- spaced review;
- a small amount of new material.

### Free Practice

Allows choosing:

```text
A. Quantity
B. Number Bonds
C. Mental Math
D. Missing Numbers
E. Picture Math
F. Triangles
```

Free Practice records attempts and may update skill evidence, but it should not aggressively advance the curriculum.

## 3.2. Parent Mode

Protected by a simple 4-digit PIN.

Features:

- skill dashboard;
- micro-skill detail;
- recent sessions;
- weak skills;
- practice history;
- curriculum view;
- focus/pause/unlock controls;
- progress reset for a skill;
- export progress;
- import progress;
- settings.

---

# 4. Progression Control

Use a **hybrid progression model**.

The adaptive engine advances normally.

Parent Mode may override:

```text
Focus skill
Pause skill
Practice now
Unlock skill
Reset skill evidence
```

Parent overrides should be explicit and reversible.

---

# 5. Gamification

Gamification should be positive but lightweight.

## 5.1. Stars

Each completed Today's Practice session earns 1–3 stars.

Suggested interpretation:

```text
★    session completed
★★   good persistence / reasonable independence
★★★  strong independence with little help
```

Stars should not be removed for mistakes.

The exact formula should use:

- session completion;
- effort;
- hint dependence;
- persistence.

Do not make accuracy the sole determinant.

## 5.2. Streak

A streak is the number of consecutive local calendar days on which Today's Practice was completed.

Example:

```text
🔥 5 days
```

Rules:

- exactly one streak credit per day;
- Free Practice does not count;
- missing one day resets the active streak;
- retain best streak separately.

## 5.3. Praise

Prefer strategy/effort praise:

```text
Great — you found it without a hint.
Nice! You used 5 to find 8.
Good job checking again.
You found another big triangle!
```

Avoid exaggerated intelligence praise.

## 5.4. No punitive mechanics

Do not use:

- lives;
- hearts lost on wrong answers;
- timers;
- leaderboards;
- coins required to continue.

---

# 6. Visual Design

## 6.1. Typeface

Primary font:

```text
Nunito
```

Self-host it.

Use only required weights:

```text
500 body/prompts
600 buttons/labels
700 headings/numbers/rewards
```

Fallback:

```css
font-family: "Nunito", system-ui, sans-serif;
```

Vietnamese diacritics must render correctly.

## 6.2. Visual style

Use:

- flat shapes;
- rounded geometry;
- simple illustrations;
- clear outlines;
- low visual noise;
- large touch targets.

Avoid:

- photorealism;
- gradients-heavy clipart;
- detailed cartoon scenes;
- visual effects that obscure math structure.

## 6.3. SVG-first

Instructional graphics should primarily use SVG.

Use SVG for:

- dots;
- counters;
- five-frames;
- ten-frames;
- number bonds;
- number lines;
- simple object illustrations;
- story scenes;
- triangle geometry;
- selection/highlight regions.

Avoid Canvas unless a real need appears.

## 6.4. Emoji policy

Emoji may be temporary development placeholders only.

Production instructional graphics should not depend on OS emoji rendering.

## 6.5. Object illustration library

Create a small self-hosted SVG object set.

Suggested initial objects:

```text
apple
orange
strawberry
fish
bird
butterfly
ball
car
flower
pencil
book
star
cat
rabbit
```

Abstract modules should prefer counters/shapes rather than decorative objects.

Module E should use semantic illustrated objects more heavily.

---

# 7. Responsive Layout

Primary orientation: **portrait-first responsive**.

Do not lock orientation.

Design around a logical exercise area that scales within the viewport.

The same exercise model must support:

- iPad 4:3 portrait;
- iPad landscape;
- narrow phone portrait.

Guidelines:

- primary answer controls near the lower half;
- large touch targets;
- no hover-only interaction;
- no tiny draggable objects;
- avoid content requiring precise mouse-like pointing;
- keep the central math scene visually dominant.

---

# 8. Curriculum

---

# Module A — Quantity Recognition

## Goal

Reduce one-by-one counting and build instant/structured quantity recognition.

## A1 — Recognize 1–3

Show small dot groups.

```text
● ●
```

Ask for quantity.

Target: recognize without sequential counting.

## A2 — Structured 4–5

Use recognizable patterns:

```text
●   ●
●   ●
```

or:

```text
●   ●
  ●
●   ●
```

Representations may include:

- dice layouts;
- domino layouts;
- five-frame.

## A3 — Five-frame

Example:

```text
┌─┬─┬─┬─┬─┐
│●│●│●│●│ │
└─┴─┴─┴─┴─┘
```

Train:

```text
frame → number
number → frame
```

## A4 — 6–10 as `5 + ?`

Use ten-frame structure.

```text
┌─┬─┬─┬─┬─┐
│●│●│●│●│●│
├─┼─┼─┼─┼─┤
│●│●│ │ │ │
└─┴─┴─┴─┴─┘
```

Desired thought:

```text
5 + 2 = 7
```

not one-by-one counting.

## A5 — Flash Quantity

Show a quantity briefly and hide it.

Initial display may be around 1–1.5 seconds.

Adapt display duration based on success.

Do not display a visible timer.

## A6 — Multiple Representations

Example number 7:

```text
dots
ten-frame
5 + 2 structure
numeral 7
```

The child should recognize equivalence.

## A mastery evidence

Strong evidence:

- 1–5 recognized without sequential counting;
- 6–10 usually understood through 5-based structure;
- recognition survives layout changes;
- little hint dependence.

---

# Module B — Number Composition / Decomposition

## Goal

Understand numbers as parts forming a whole.

This is the central curriculum module.

Example:

```text
7 = 0 + 7
7 = 1 + 6
7 = 2 + 5
7 = 3 + 4
```

## B1 — Combine Two Groups

Show:

```text
● ● ●     ● ●
```

Ask:

```text
How many altogether?
```

Initially phrase as:

```text
3 and 2 make 5
```

before emphasizing symbolic `+`.

## B2 — Split One Group

Start with 6 counters.

Child moves 2 aside:

```text
● ● ● ● | ● ●
```

Ask for the other part.

## B3 — Part-Whole Diagram

```text
    6
   / \
  2   ?
```

Initially multiple choice, later direct input.

## B4 — Number Families

Train one whole at a time.

Example whole = 6:

```text
0 + 6
1 + 5
2 + 4
3 + 3
```

Track each pair independently.

## B5 — Both Directions

Missing part:

```text
    8
   / \
  3   ?
```

Missing whole:

```text
    ?
   / \
  3   5
```

## B6 — Make 5

Practice:

```text
0–5
1–4
2–3
```

## B7 — Make 10

Practice strongly:

```text
0–10
1–9
2–8
3–7
4–6
5–5
```

## B8 — Fact Families

From:

```text
    8
   / \
  3   5
```

derive:

```text
3 + 5 = 8
5 + 3 = 8
8 - 3 = 5
8 - 5 = 3
```

## B9 — Mixed Representation

Use the same number relation in:

- counters;
- frames;
- part-whole;
- symbolic equations.

---

# Module C — Mental Addition / Subtraction

## Goal

Move from finger counting toward efficient strategies.

## C1 — `+0`, `-0`

Teach “no change”.

## C2 — `+1`, `-1`

Use previous/next number.

```text
6 + 1 → 7
6 - 1 → 5
```

## C3 — `+2`, `-2`

Teach count-on/count-back from the known number.

```text
6 → 7 → 8
```

## C4 — Start From the Larger Addend

Example:

```text
2 + 7
```

Prompt:

```text
Which number is easier to start from?
```

Then:

```text
7 → 8 → 9
```

## C5 — Doubles

Practice:

```text
1+1
2+2
3+3
4+4
5+5
```

Use as anchor facts.

## C6 — Near Doubles

Example:

```text
4 + 5
```

Hint:

```text
4 + 4 = 8
one more → 9
```

## C7 — Use 5 as an Anchor

Example:

```text
5 + 3 = 8
```

May later introduce bridging through 5.

Do not require one single strategy if another efficient strategy works.

## C8 — Make 10 Facts

Practice:

```text
1+9
2+8
3+7
4+6
5+5
```

## C9 — Subtraction via Number Bonds

Example:

```text
8 - 3
```

Possible scaffold:

```text
3 + ? = 8
```

Especially useful when counting backward would require many steps.

## C10 — Mixed Facts

Only after strategy-specific practice:

```text
8 + 1
10 - 7
3 + 5
9 - 4
4 + 6
10 - 2
```

Every generated fact must retain underlying skill tags for remediation.

---

# Module D — Missing Numbers

## Goal

Develop relational and inverse reasoning.

## D1 — Missing Result

```text
4 + 3 = ?
```

## D2 — Missing Second Addend

```text
4 + ? = 7
```

Scaffold with part-whole.

## D3 — Missing First Addend

```text
? + 3 = 7
```

## D4 — Missing Subtraction Result

```text
7 - 3 = ?
```

## D5 — Missing Removed Amount

```text
7 - ? = 4
```

Visual:

```text
● ● ● ● | ● ● ●
 remain 4 | removed ?
```

## D6 — Missing Starting Amount

```text
? - 3 = 4
```

Scaffold through:

```text
? = 3 + 4
```

## D7 — Rotate Unknown Position

For numbers `2, 5, 7`:

```text
2 + 5 = ?
2 + ? = 7
? + 5 = 7
7 - 2 = ?
7 - ? = 5
? - 2 = 5
```

## D8 — Mixed Unknown Positions

After individual forms are stable:

```text
? + 3 = 8
9 - ? = 4
2 + ? = 7
? - 5 = 3
```

Avoid long runs of identical templates.

---

# Module E — Picture / Story → Equation

## Goal

Convert visual situations into mathematical models.

Modeling errors and arithmetic errors must be distinguished.

## E1 — Increase or Decrease?

Example animation:

```text
3 fish
2 more swim in
```

Ask:

```text
[ Increasing ] [ Decreasing ]
```

No equation yet.

## E2 — Before and After

Example:

```text
Before: ● ● ● ● ●
2 leave
After:  ● ● ●
```

Ask whether there are more or fewer afterward.

## E3 — Identify Parts and Whole

Show two groups, then combine.

Connect to:

```text
PART + PART = WHOLE
```

## E4 — Choose Operator

Example:

```text
6 birds
2 fly away
```

Ask:

```text
[ + ] [ - ]
```

If wrong, replay the action instead of immediately revealing the answer.

## E5 — Choose Relevant Numbers

Example:

```text
7 objects initially
3 removed
```

Give cards:

```text
2  3  4  7  10
```

Child forms:

```text
7 - 3
```

## E6 — Choose Full Equation

Example:

```text
7 + 3 = 10
7 - 3 = 4
3 - 7 = 4
```

Distractors should represent specific misconceptions.

## E7 — Build Equation

Slots:

```text
[number] [+/−] [number] = [number]
```

Classify errors.

Example:

```text
7 + 3 = 10
```

Arithmetic valid, model wrong.

Remediation:

```text
E4/E5
```

Example:

```text
7 - 3 = 5
```

Model correct, arithmetic wrong.

Remediation:

```text
Module C
```

## E8 — Addition Story Types

Support at least:

```text
combine
add-to
```

## E9 — Subtraction Story Types

Support at least:

```text
take-away
missing-part
```

## E10 — Fade Visual Support

Progression:

```text
clear animation
    ↓
before/after images
    ↓
single static picture
    ↓
independent equation construction
```

Final task style should resemble school worksheets.

---

# Module F — Triangle Counting

## Goal

Teach systematic visual decomposition and prevent:

- missed composite triangles;
- duplicate counting;
- random scanning;
- counting only the smallest triangles.

Module F is structurally different from A–E and should use explicit geometry data.

## F1 — Separate Triangles

Show several independent triangles.

Ask for count or let the child tap each one.

Purpose: establish interaction.

## F2 — Simple Composite Shape

Use a figure with a small number of triangles formed by subdivisions.

Primary interaction:

```text
Find all the triangles.
```

Child taps triangles directly.

Each valid triangle is highlighted once found.

## F3 — Count by Size

Ask separately:

```text
Find the small triangles.
Find the larger triangles.
How many altogether?
```

Teach systematic search.

## F4 — Find the Missing Triangle

After the child has found most triangles:

```text
You found 5. There is one more.
Can you find it?
```

Use this as a scaffold before revealing geometry.

## F5 — Composite Triangles

Explicitly include triangles made from multiple smaller regions.

The app should record whether the child tends to miss:

```text
small
medium
large/composite
```

triangles.

## F6 — Independent Count

Final worksheet-like form:

```text
How many triangles are there?
[ ? ]
```

No highlighting unless a hint is requested.

## F7 — Hint progression

Suggested:

```text
S0: Count independently.

S1: Try looking from small to large.

S2: "You found all small triangles. Look for triangles made from more than one part."

S3: Highlight an area/edge group containing an unfound triangle without fully selecting it.
```

## F geometry model

A triangle exercise should define:

```ts
type PointId = string;
type EdgeId = string;
type TriangleId = string;

interface Point {
  id: PointId;
  x: number;
  y: number;
}

interface Edge {
  id: EdgeId;
  a: PointId;
  b: PointId;
}

interface ValidTriangle {
  id: TriangleId;
  vertices: [PointId, PointId, PointId];
  sizeClass: 'small' | 'medium' | 'large';
}
```

A complete geometry item:

```ts
interface TriangleExerciseDefinition {
  id: string;
  points: Point[];
  edges: Edge[];
  validTriangles: ValidTriangle[];
}
```

The renderer creates SVG geometry and touch hit regions.

Do not infer valid triangles dynamically in v1.

Author them explicitly so evaluation is deterministic.

---

# 9. Cross-Module Integration

Modules must share underlying number relationships.

Example fact family:

```text
3 – 5 – 8
```

A:

```text
Recognize 8 in a ten-frame
```

B:

```text
    8
   / \
  3   ?
```

C:

```text
3 + 5 = ?
```

D:

```text
8 - ? = 5
```

E:

```text
8 birds, 3 fly away → 8 - 3 = 5
```

The adaptive engine should intentionally revisit the same facts across different representations.

---

# 10. Exercise Architecture

Do not model every exercise as:

```text
question + answer
```

Exercises have different interaction models.

Use a discriminated union.

Example:

```ts
type Exercise =
  | QuantityExercise
  | PartWholeExercise
  | ArithmeticExercise
  | MissingNumberExercise
  | StoryExercise
  | TriangleExercise;
```

Common metadata:

```ts
interface ExerciseBase {
  id: string;
  module: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  skillIds: string[];
  difficulty: number;
  representation: RepresentationType;
  promptKey: string;
}
```

Possible representation types:

```ts
type RepresentationType =
  | 'dots'
  | 'five-frame'
  | 'ten-frame'
  | 'part-whole'
  | 'number-line'
  | 'equation'
  | 'object-scene'
  | 'story-animation'
  | 'triangle-svg';
```

---

# 11. Exercise Generation

A–E should primarily be rule-generated.

F should primarily use authored geometry templates with parameterized presentation where safe.

Every generated exercise must be reproducible from:

```text
generator version
seed
parameters
```

Suggested:

```ts
interface GeneratedExerciseRef {
  generatorId: string;
  generatorVersion: number;
  seed: number;
  params: Record<string, unknown>;
}
```

Benefits:

- deterministic debugging;
- ability to replay wrong questions;
- easy tests;
- stable history.

---

# 12. Evaluation Model

Evaluation must return more than correct/incorrect.

Example:

```ts
interface EvaluationResult {
  correct: boolean;
  normalizedAnswer: unknown;
  errorCode?: ErrorCode;
  evidence: SkillEvidence[];
  nextHintSuggestion?: HintLevel;
}
```

Possible error categories:

```ts
type ErrorCode =
  | 'wrong-count'
  | 'counted-one-by-one'
  | 'wrong-number-bond'
  | 'wrong-operator'
  | 'reversed-operands'
  | 'arithmetic-error'
  | 'unknown-position-error'
  | 'missed-small-triangle'
  | 'missed-composite-triangle'
  | 'duplicate-triangle'
  | 'other';
```

Some categories may be inferred only when interaction data supports them.

Do not fabricate diagnostic certainty.

---

# 13. Attempt Data

Record each completed attempt locally.

```ts
interface Attempt {
  id: string;
  sessionId?: string;
  exerciseId: string;

  module: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  skillIds: string[];

  startedAt: number;
  completedAt: number;
  responseMs: number;

  correct: boolean;
  hintLevelUsed: 0 | 1 | 2 | 3;
  hintCount: number;

  answer: unknown;
  errorCode?: ErrorCode;

  representation: RepresentationType;

  source:
    | 'today'
    | 'free-practice'
    | 'parent-practice';

  generator?: GeneratedExerciseRef;
}
```

For Module F also store:

```ts
interface TriangleAttemptDetail {
  selectedTriangleIds: string[];
  duplicateSelections: number;
  foundBySize: {
    small: number;
    medium: number;
    large: number;
  };
}
```

---

# 14. Skill Model

Track micro-skills rather than only module completion.

Examples:

```text
A.quantity.1-3
A.quantity.4-5-structured
A.quantity.6-10-five-anchor

B.bond.5
B.bond.6
B.bond.7
B.bond.8
B.bond.9
B.bond.10

C.plus1
C.minus1
C.plus2
C.minus2
C.doubles
C.near-doubles
C.make10
C.subtract-via-bond

D.add.missing-result
D.add.missing-first
D.add.missing-second
D.sub.missing-result
D.sub.missing-removed
D.sub.missing-start

E.semantic.increase-decrease
E.operator
E.pick-numbers
E.build-equation
E.add.combine
E.add.add-to
E.sub.take-away
E.sub.missing-part

F.find-small
F.find-composite
F.systematic-count
F.independent-count
```

---

# 15. Mastery State

Do not reduce mastery to one permanent percentage with fake precision.

Use a small state plus evidence score.

Suggested state:

```ts
type MasteryStage =
  | 'locked'
  | 'new'
  | 'learning'
  | 'practicing'
  | 'stable'
  | 'review';
```

Example:

```ts
interface SkillState {
  skillId: string;
  stage: MasteryStage;

  score: number; // 0..1 internal evidence score

  totalAttempts: number;
  recentCorrect: number;
  recentIndependentCorrect: number;

  lastPracticedAt?: number;
  lastSuccessfulAt?: number;

  parentFocus?: boolean;
  parentPaused?: boolean;
  manuallyUnlocked?: boolean;
}
```

The score is an implementation heuristic, not a user-facing scientific measurement.

---

# 16. Updating Mastery

Evidence strength should depend on:

1. correctness;
2. hint level;
3. representation diversity;
4. repeated success;
5. delayed success;
6. response-time trend.

Suggested qualitative weighting:

```text
correct, no hint           strong positive
correct, hint S1           positive
correct, hint S2           weak positive
correct, hint S3           minimal positive
wrong, then self-correct   small/neutral
wrong repeatedly           negative evidence
success after several days strong retention evidence
```

Do not sharply reduce mastery from a single mistake.

Do not advance a skill only because of repeated identical-template success in one session.

---

# 17. Adaptive Session Planner

Today's Practice target: about 15–20 interactions.

Suggested mix:

```text
50% current learning target
30% spaced review
15% weak-skill remediation
5% new challenge
```

This is a target distribution, not a strict quota.

## Session construction

Inputs:

```ts
interface SessionPlanningContext {
  skillStates: SkillState[];
  recentAttempts: Attempt[];
  curriculum: CurriculumDefinition;
  parentOverrides: ParentOverrides;
  now: number;
}
```

Output:

```ts
interface PlannedSession {
  id: string;
  targetDurationMin: number;
  slots: ExerciseSlot[];
}
```

A slot describes intent, not necessarily an already generated question:

```ts
interface ExerciseSlot {
  purpose:
    | 'learn'
    | 'review'
    | 'remediate'
    | 'challenge';

  preferredSkillIds: string[];
  preferredRepresentations?: RepresentationType[];
}
```

The next exact exercise may be selected just-in-time.

## Avoid repetition

Do not present long runs of the same visual template.

Prefer interleaving once a concept is sufficiently introduced.

Example bad sequence:

```text
4 + ? = 7
3 + ? = 7
2 + ? = 7
1 + ? = 7
```

Better later-stage sequence:

```text
4 + ? = 7
ten-frame 8
7 - ? = 5
picture subtraction
3 + 4
```

---

# 18. Hint Engine

Hints are exercise-specific but use a common interface.

```ts
type HintLevel = 0 | 1 | 2 | 3;

interface Hint {
  level: HintLevel;
  type:
    | 'text'
    | 'visual'
    | 'animation'
    | 'interaction';
  payload: unknown;
}
```

The exercise definition/generator must know how to produce valid hints.

Hints should degrade gracefully on old Safari.

Avoid timing-sensitive animation as required logic.

---

# 19. Session Completion

A Today's Practice session is complete when:

- planned minimum learning content has been attempted;
- the child has completed roughly the target interaction count;
- no exercise is currently incomplete.

Do not extend sessions indefinitely because of mistakes.

If remediation is needed beyond the session, schedule it for future practice.

At completion:

1. show short celebration;
2. award stars;
3. update streak;
4. show one or two simple achievements;
5. return to Child Home.

Example:

```text
Practice complete!
★★★

You practiced number bonds.
You found big triangles more carefully today.
```

---

# 20. Parent Dashboard

## 20.1. Overview

Show:

```text
Today's practice: completed / not completed
Current streak
Best streak
Recent stars
Total practice days
```

## 20.2. Module summary

For A–F show:

```text
Strong
Learning
Needs practice
Not started
```

Avoid overloading the parent with fake numerical precision.

## 20.3. Micro-skill detail

For each skill show:

- current stage;
- recent accuracy;
- independent accuracy;
- hint use;
- last practiced;
- trend;
- recent common errors.

Example:

```text
B.bond.8
Stage: Learning
Recent: 7/10 correct
Without hints: 4/10
Common weak pair: 3 + 5
Last practiced: yesterday
```

## 20.4. Controls

Allow:

```text
Focus
Pause
Practice now
Unlock
Reset evidence
```

Reset must require confirmation.

## 20.5. Attempt history

Do not show every raw event by default.

Provide recent session drill-down with:

- exercise;
- child's answer;
- correct answer;
- hint level;
- response time;
- error type.

Module F should allow replaying the geometry with selected/found triangles.

---

# 21. Local Persistence

Use IndexedDB as the primary persistent store.

Do not use `localStorage` for core progress.

Suggested stores:

```text
profile
settings
skills
attempts
sessions
rewards
curriculumState
metadata
```

Schema versioning is required from day one.

Example:

```ts
interface AppMetadata {
  schemaVersion: number;
  createdAt: number;
  lastOpenedAt: number;
}
```

Persistence must be behind an adapter interface.

```ts
interface ProgressRepository {
  getProfile(): Promise<ChildProfile>;
  saveProfile(profile: ChildProfile): Promise<void>;

  getSkillStates(): Promise<SkillState[]>;
  putSkillStates(states: SkillState[]): Promise<void>;

  addAttempt(attempt: Attempt): Promise<void>;
  listAttempts(query: AttemptQuery): Promise<Attempt[]>;

  saveSession(session: SessionRecord): Promise<void>;

  exportAll(): Promise<ProgressExport>;
  importAll(data: ProgressExport): Promise<void>;
}
```

Core logic must not import IndexedDB directly.

---

# 22. Export / Import

Because v1 has no remote sync, backup is required.

Parent Mode must support:

```text
Export progress
Import progress
```

Format:

```text
JSON
```

Include:

```ts
interface ProgressExport {
  format: 'grade1-math-progress';
  version: number;
  exportedAt: number;

  profile: ChildProfile;
  settings: AppSettings;
  skillStates: SkillState[];
  sessions: SessionRecord[];
  attempts: Attempt[];
  rewards: RewardState;
}
```

Import behavior:

1. validate format;
2. validate version;
3. migrate if supported;
4. preview summary;
5. require confirmation;
6. replace local state atomically.

Do not silently merge in v1.

---

# 23. PWA / Offline Behavior

The app should remain fully usable offline after initial installation/load.

Cache:

- application shell;
- JS/CSS;
- Nunito font files;
- SVG illustration assets;
- authored triangle definitions;
- static curriculum data.

Runtime progress remains in IndexedDB.

Network is not required for:

- practicing;
- generating exercises;
- hints;
- evaluation;
- dashboard;
- rewards;
- export.

If an updated app version is available, do not force-refresh during an active exercise/session.

Offer update after session completion or from home.

---

# 24. Future Backend Boundary

No backend is required in v1.

However, persistence must support a future sync adapter.

Conceptual future architecture:

```text
Domain
  ↓
ProgressRepository
  ↓
Local IndexedDB
  ↓
optional Sync Service
  ↓
remote backend
```

Potential future backend responsibilities:

- account/auth;
- device sync;
- backup;
- conflict resolution.

The adaptive engine must remain client-side.

The server must not be required to select the next question.

---

# 25. Frontend Stack

Use:

```text
Svelte 5
TypeScript
Vite
PWA
IndexedDB
SVG + CSS
```

Do not use:

```text
React
SvelteKit
global state library by default
component library by default
backend in v1
runtime image generation
runtime web-font dependency
```

Keep framework-specific code out of the domain layer.

---

# 26. Source Structure

Suggested structure:

```text
src/
├── core/
│   ├── curriculum/
│   ├── skills/
│   ├── mastery/
│   ├── adaptive/
│   ├── session/
│   ├── evaluation/
│   └── gamification/
│
├── exercises/
│   ├── quantity/
│   ├── number-bond/
│   ├── arithmetic/
│   ├── missing-number/
│   ├── story/
│   └── triangle/
│
├── persistence/
│   ├── repository.ts
│   ├── indexeddb/
│   ├── migrations/
│   └── export-import/
│
├── assets/
│   ├── fonts/
│   ├── objects/
│   └── icons/
│
├── ui/
│   ├── child/
│   ├── parent/
│   ├── exercises/
│   └── shared/
│
├── app/
│   ├── navigation/
│   ├── state/
│   └── pwa/
│
└── main.ts
```

---

# 27. Domain Purity Rule

Files under `core/` and exercise generation/evaluation logic should be pure TypeScript wherever possible.

They must not depend on:

- Svelte components;
- DOM;
- browser storage;
- routing;
- CSS;
- device APIs.

Preferred function style:

```ts
generateExercise(...)
evaluateAttempt(...)
updateMastery(...)
planSession(...)
selectNextExercise(...)
calculateSessionStars(...)
```

Benefits:

- deterministic tests;
- easy agent implementation;
- easier future framework replacement;
- easier replay/debugging.

---

# 28. UI State

Svelte reactive state should be limited to UI/application coordination.

Examples:

- current route;
- current session;
- current exercise;
- temporary interaction state;
- modal state;
- parent mode state.

Do not move domain rules into Svelte stores.

---

# 29. Browser Compatibility

Hard target:

```text
Safari 15 / iPadOS 15.8.x
```

Also support modern:

- iOS Safari;
- Android Chrome;
- desktop browsers for development/parent use.

Requirements:

- explicit browser build target;
- no reliance on current Vite defaults;
- test actual production bundle on Safari 15-class behavior;
- avoid unsupported APIs unless polyfilled or feature-detected;
- no hover dependency;
- touch-first interaction;
- test service-worker update behavior;
- test IndexedDB migrations.

Prefer simple web platform features over new browser APIs when possible.

---

# 30. Performance Budget

Primary hardware is old.

Optimize for responsiveness rather than fancy effects.

Guidelines:

- no large UI framework;
- no large animation library by default;
- no heavy charting library;
- no large image assets;
- SVG assets should be simple;
- lazy-load Parent Mode if useful;
- avoid unnecessary reactive recomputation;
- avoid re-rendering entire scenes during drag/tap;
- keep animations transform/opacity based where possible.

A normal exercise transition should feel immediate.

Touch feedback should occur immediately even if persistence happens asynchronously.

---

# 31. Accessibility / Usability

Even though this is a single-child app, maintain basic accessibility.

Requirements:

- large tap targets;
- sufficient text contrast;
- visible focus states for keyboard development/testing;
- do not use color as the only correctness signal;
- math content must remain understandable without animation;
- support reduced motion when practical;
- readable Vietnamese text;
- no tiny superscripts/subscripts for core Grade 1 math.

Correct/incorrect feedback should combine visual state with text/icon.

---

# 32. Correctness Feedback

For a correct answer:

- immediate positive state;
- short praise;
- brief transition.

For a wrong answer:

- do not flash harsh red full-screen;
- allow one self-correction when pedagogically useful;
- then provide scaffold;
- record original error;
- do not repeatedly force the exact same item until correct.

Suggested flow:

```text
attempt
  ↓
wrong
  ↓
small feedback
  ↓
optional retry
  ↓
hint / scaffold
  ↓
child completes
  ↓
move on
```

---

# 33. Story Scene Model

Do not create static image files for every number combination.

Generate scenes from data.

Example:

```ts
type StoryOperation = 'add-to' | 'take-away' | 'combine' | 'missing-part';

interface StoryExercise extends ExerciseBase {
  kind: 'story';
  storyType: StoryOperation;
  objectKind: ObjectKind;

  startCount?: number;
  changeCount?: number;
  partA?: number;
  partB?: number;
  total?: number;

  unknown: 'operator' | 'number-a' | 'number-b' | 'result' | 'full-equation';
}
```

The UI composes repeated SVG objects.

Animation should represent semantics, not decoration.

Example take-away:

```text
objects start grouped
    ↓
selected subset moves away
    ↓
remaining group stays visible
```

---

# 34. Object Asset API

Domain code references semantic IDs only.

```ts
type ObjectKind =
  | 'apple'
  | 'orange'
  | 'strawberry'
  | 'fish'
  | 'bird'
  | 'butterfly'
  | 'ball'
  | 'car'
  | 'flower'
  | 'pencil'
  | 'book'
  | 'star'
  | 'cat'
  | 'rabbit';
```

UI maps IDs to SVG assets.

Changing art style must not require changing exercise generators.

---

# 35. Randomness

Randomness should be controlled.

Use seeded PRNG for generated exercises.

Avoid pure `Math.random()` deep inside domain logic.

Reasons:

- deterministic tests;
- reproduce bugs;
- replay attempts;
- inspect why a specific exercise was generated.

---

# 36. Curriculum Definition

Curriculum relationships should be data-driven.

Example:

```ts
interface SkillDefinition {
  id: string;
  module: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  prerequisites: string[];
  exerciseGenerators: string[];
  reviewAfterDays?: number[];
}
```

Example:

```ts
{
  id: 'C.make10',
  module: 'C',
  prerequisites: ['B.bond.10'],
  exerciseGenerators: ['addition-make10']
}
```

Avoid hard-coding all progression conditions inside UI components.

---

# 37. Parent Overrides

Suggested model:

```ts
interface ParentOverrides {
  focusedSkillIds: string[];
  pausedSkillIds: string[];
  manuallyUnlockedSkillIds: string[];
}
```

Effects:

### Focus

Raises skill selection priority.

Does not make the entire session one repeated skill.

### Pause

Prevents new practice for that skill except if needed as a prerequisite scaffold.

### Unlock

Allows practice before automatic progression would normally expose it.

### Reset

Clears accumulated skill evidence after confirmation.

Attempt history may remain unless explicitly deleted.

---

# 38. Rewards Data

```ts
interface RewardState {
  totalStars: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate?: string; // local YYYY-MM-DD
}
```

A `SessionRecord` stores stars awarded so recalculation is not required on every load.

---

# 39. Session Record

```ts
interface SessionRecord {
  id: string;
  type: 'today' | 'free-practice' | 'parent-practice';

  startedAt: number;
  completedAt?: number;

  attemptIds: string[];

  plannedSkillIds: string[];
  practicedSkillIds: string[];

  completed: boolean;
  starsAwarded?: 1 | 2 | 3;
}
```

---

# 40. Child Profile

Keep minimal data.

```ts
interface ChildProfile {
  id: 'primary';
  displayName?: string;
  createdAt: number;
}
```

Do not collect unnecessary personal data.

---

# 41. Settings

Possible settings:

```ts
interface AppSettings {
  parentPinHash?: string;

  reducedMotion: boolean;

  dailyTargetMin: number; // default ~10
  showStreak: boolean;
  showStars: boolean;

  locale: 'vi-VN';
}
```

Do not store the parent PIN in plaintext.

For this offline single-device threat model, PIN is a child-access barrier, not strong security.

---

# 42. Testing Strategy

## 42.1. Core unit tests

Required for:

- exercise generation;
- valid answer evaluation;
- hint generation;
- mastery updates;
- session planning;
- reward calculation;
- curriculum prerequisites;
- export/import migrations.

## 42.2. Property/invariant tests

Useful invariants:

```text
all generated operands remain in allowed range
addition results do not exceed module limits
subtraction does not produce negative values
missing-number equations have exactly one intended answer
fact-family equations remain consistent
triangle validTriangles reference existing points
```

## 42.3. Component tests

Test key interactions:

- selecting answers;
- drag/tap behavior;
- hint transitions;
- equation builder;
- ten-frame;
- triangle selection.

## 42.4. End-to-end flows

At minimum:

```text
first launch
Today's Practice
session completion
streak update
Parent PIN entry
dashboard
Free Practice
export
import
offline reload
app update
```

## 42.5. Old-device testing

Safari 15 compatibility is a release criterion, not optional QA.

---

# 43. Error Handling

The app should never lose a completed attempt because a later UI step fails.

Persistence operations should be resilient.

If IndexedDB write fails:

- keep current interaction usable;
- show parent-facing warning when appropriate;
- avoid repeatedly interrupting the child.

If saved state cannot be loaded:

- do not silently reset progress;
- offer recovery/import path.

---

# 44. Data Migration

Every persisted schema must have a numeric version.

Migrations should be:

- deterministic;
- forward-only;
- tested with fixtures;
- atomic where practical.

Never make a new release require clearing IndexedDB.

---

# 45. Privacy

v1 has no account and no remote telemetry requirement.

Default behavior:

```text
all child learning data stays on device
```

No analytics SDK is required.

If analytics is ever added later, it must be optional and must not be required for adaptive behavior.

---

# 46. Non-Goals for v1

Do not build:

- multi-child profiles;
- remote sync;
- account registration;
- teacher/classroom features;
- leaderboards;
- voice prompts;
- OCR worksheet import;
- AI-generated exercises at runtime;
- LLM tutoring;
- cloud image generation;
- multiplayer;
- arithmetic beyond 10 unless explicitly added later;
- complex achievements economy.

---

# 47. Implementation Phases

## Phase 0 — Foundation

Build:

- app shell;
- routing;
- Child/Parent modes;
- Parent PIN;
- IndexedDB repository;
- export/import;
- PWA/offline;
- font/assets;
- base exercise contract;
- seeded randomness;
- skill registry.

## Phase 1 — Module A

Build:

- dots;
- five-frame;
- ten-frame;
- flash quantity;
- quantity evaluation;
- A micro-skills.

## Phase 2 — Module B

Build reusable core representations:

- counters;
- split/combine;
- part-whole;
- number-bond generators;
- make-5/make-10;
- fact families.

This is the most important reusable module.

## Phase 3 — Module C

Build:

- arithmetic generators;
- strategy hints;
- number line;
- doubles;
- near doubles;
- make-10;
- subtraction through bonds.

## Phase 4 — Module D

Build:

- unknown-position equation engine;
- missing addends;
- missing subtraction terms;
- fact-family rotation.

## Phase 5 — Module E

Build:

- SVG object library;
- generated scenes;
- story semantics;
- operator selection;
- number selection;
- equation builder;
- error classification.

## Phase 6 — Module F

Build:

- authored geometry format;
- SVG triangle renderer;
- hit regions;
- selection tracking;
- size classification;
- triangle-specific hinting.

## Phase 7 — Adaptive System

Build:

- skill evidence;
- mastery state;
- planner;
- just-in-time next exercise selection;
- spaced review;
- parent focus/pause.

Before this phase, modules may use a simple deterministic sequence for development.

## Phase 8 — Dashboard / Rewards Polish

Build:

- micro-skill dashboard;
- history drill-down;
- stars;
- streak;
- session summary;
- trend presentation.

## Phase 9 — Old-device Optimization

Profile and reduce:

- JS startup;
- SVG complexity;
- memory use;
- long-task sources;
- IndexedDB bottlenecks;
- animation cost.

---

# 48. Definition of MVP

MVP is complete when:

1. App installs/loads as a PWA.
2. It works after network loss.
3. Progress persists locally.
4. Progress can be exported/imported.
5. Parent Mode is PIN-protected.
6. Modules A–F each have at least one complete learning progression, not only a demo question.
7. Today's Practice produces a mixed session.
8. Attempts update micro-skill evidence.
9. Wrong answers can trigger meaningful hints.
10. Parent dashboard shows micro-skill status.
11. Stars and daily streak work.
12. Production build is usable on iPadOS 15.8.x.
13. No backend is required.
14. No production exercise depends on emoji rendering.

---

# 49. Acceptance Criteria by Module

## A

- Child can practice quantities 1–10.
- Supports dots, five-frame, ten-frame.
- Includes flash quantity.
- Hinting can restore structure.
- Tracks 1–5 vs 6–10 structured recognition separately.

## B

- Supports part/whole in both directions.
- Supports bonds 5–10.
- Supports make-5 and make-10.
- Fact families connect addition and subtraction.
- Weak pairs can be tracked independently.

## C

- Supports strategy-specific practice.
- Mixed facts remain tagged by strategy.
- Hinting teaches count-on/bonds rather than only showing answer.
- Finger use is neither detected nor punished.

## D

- All six important unknown positions are supported.
- Can rotate unknown through a fact family.
- Part-whole hints are available.

## E

- Supports increase/decrease recognition.
- Supports operator-only questions.
- Supports choosing relevant numbers.
- Supports complete equation construction.
- Distinguishes modeling vs arithmetic errors.
- Uses self-hosted SVG object assets.

## F

- Geometry is deterministic.
- Child can tap valid triangles.
- Duplicate taps can be detected.
- Composite triangles are represented explicitly.
- Hints can target size/search strategy.
- Final independent count resembles worksheet tasks.

---

# 50. Coding-Agent Rules

When assigning implementation work to a coding agent, include these rules:

1. **Do not introduce React.**
2. **Do not introduce SvelteKit unless the architecture is explicitly revised.**
3. **Do not put curriculum/adaptive logic in Svelte components.**
4. **Do not add a backend for convenience.**
5. **Do not depend on network access for exercise execution.**
6. **Do not use emoji as production instructional assets.**
7. **Do not use unseeded randomness inside domain generators.**
8. **Do not assume current Chrome behavior equals target Safari behavior.**
9. **Do not add large dependencies without justification.**
10. **Prefer pure TypeScript and deterministic data structures.**
11. **Persist schema changes through migrations, never by clearing storage.**
12. **Every exercise generator must be unit-testable without DOM/Svelte.**
13. **Every wrong-answer remediation must map to a pedagogical reason when possible.**
14. **Do not expose internal mastery score as authoritative educational measurement.**
15. **Keep touch interaction usable on an old iPad.**

---

# 51. Suggested First Engineering Milestone

Do not start by implementing all modules.

First build an end-to-end vertical slice:

```text
PWA shell
  ↓
local profile
  ↓
Today's Practice
  ↓
Module B part-whole exercise
  ↓
attempt evaluation
  ↓
hint
  ↓
persist attempt
  ↓
update skill evidence
  ↓
session completion
  ↓
stars
  ↓
Parent dashboard
  ↓
export progress
```

Use Module B because it exercises the core domain model and will later be reused by C, D, and E.

Once this vertical slice is stable, expand curriculum breadth.

---

# 52. Architecture Summary

```text
┌─────────────────────────────────────────────┐
│                  SVELTE UI                  │
│                                             │
│ Child Mode       Exercises       Parent UI  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             PURE TYPESCRIPT CORE            │
│                                             │
│ Curriculum                                │
│ Exercise generators                       │
│ Evaluation                                │
│ Hint logic                                │
│ Mastery                                   │
│ Adaptive planner                          │
│ Gamification                              │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             PERSISTENCE INTERFACE           │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 INDEXEDDB                   │
│                                             │
│ profile / skills / attempts / sessions      │
│ rewards / settings / metadata               │
└─────────────────────────────────────────────┘

Static PWA assets:
- JS/CSS
- Nunito
- SVG objects
- triangle definitions
- curriculum definitions

Future optional sync:
IndexedDB → Sync adapter → remote backend
```

The browser is the application.  
The backend is optional infrastructure for future synchronization, not part of the tutoring loop.
