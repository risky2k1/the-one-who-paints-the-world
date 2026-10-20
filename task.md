# TASK: BUILD AN IMMERSIVE 3D PORTFOLIO HOMEPAGE WITH THREE.JS

## 1. Role and execution mandate

Act as a senior creative developer, 3D interaction engineer, UI/UX designer, and frontend architect.

Your task is to design, implement, run, validate, and polish a complete interactive 3D portfolio homepage using **Next.js App Router, TypeScript, Three.js, and React Three Fiber**.

This is an implementation task, not a design proposal. Do not stop after producing a plan, mockup, component scaffold, or code snippets. Work directly in the available workspace, create or modify the necessary files, launch the application, test the interactions, inspect the rendered interface if browser/preview tools are available, fix discovered defects, and deliver a working project.

The creative direction and interaction requirements below are established decisions. Follow them closely.

You have creative freedom over content copy, detailed landmark designs, micro-interactions, exact spacing, and other unresolved design decisions. Use that freedom to produce a coherent, polished result rather than asking me more questions.

---

## 2. Core concept

Build an **immersive, single-viewport 3D portfolio** in which the entire homepage is one interactive world.

The visitor explores six portfolio destinations by travelling through a stylized 3D environment in a small car. Each destination corresponds to a landmark along one continuous road.

The visitor can navigate using either:

- The on-screen destination menu.
- Direct interaction with landmarks in the 3D scene.

A small stylized car moves from its current position to the selected destination. The camera follows the journey cinematographically, the navigation interface reflects the real navigation state, and a floating content panel appears when the car arrives.

The intended experience should feel like a carefully art-directed miniature world, somewhere between an interactive portfolio, a low-poly diorama, and a polished indie-game environment.

**This is not a conventional scrolling website with a Three.js hero attached to it. The entire homepage is the experience.**

### Non-negotiable principles

1. The entire homepage stays within one viewport.
2. No document-level or page-level scrolling.
3. All six destinations belong to one continuous 3D world and one continuous road.
4. The car must move along the actual road geometry; it must not teleport between landmarks.
5. Menu navigation, direct landmark clicks, car movement, camera movement, arrival state, progress indicator, and content panels must remain synchronized.
6. The visitor can change destinations while the car is moving.
7. The most recently selected destination always wins.
8. The composition must prioritize camera framing, spatial hierarchy, readability, and visual balance.
9. Desktop and mobile must both provide a usable experience.
10. Build a functional, maintainable application, not a static visual prototype.

---

## 3. Technical stack and workspace inspection

### Preferred stack

- Next.js with App Router.
- TypeScript with strict typing where practical.
- Three.js.
- React Three Fiber.
- React Three Drei where useful.
- CSS Modules, a well-organized global stylesheet, or an appropriate existing styling system.
- A small state-management solution if needed. Prefer a clean shared state model over unnecessary dependencies.
- A testing tool appropriate to the project and existing environment.

There is **no backend requirement**. Do not introduce a server, database, authentication system, or API service unless an existing project genuinely requires it.

### Inspect before modifying

Before making changes:

1. Inspect the current workspace and its directory structure.
2. Check `package.json`, existing framework configuration, installed dependencies, and available package-manager lockfiles.
3. Inspect the current Git status if the workspace is a Git repository.
4. Identify existing changes and preserve them.
5. Determine whether there is already a suitable Next.js project.

Then:

- Reuse a suitable existing project if one is available.
- If the workspace is empty, initialize a new Next.js project.
- If the workspace contains unrelated projects, protect them and establish an appropriately isolated project directory if needed.
- Use the package manager indicated by the existing lockfile.
- Do not delete, overwrite, reset, or revert unrelated files or existing user changes.

Use client components for browser-dependent Three.js and React Three Fiber functionality. Handle server-side rendering appropriately for WebGL components, and avoid hydration errors.

Keep the 3D scene, navigation state, camera controller, vehicle animation, landmark interaction, content panels, and portfolio data logically separated.

---

## 4. Art direction

### Primary visual identity: Pastel & Dreamy

Create an airy, tranquil, artistic world with soft lighting and a sophisticated, cool pastel palette.

Core colors:

- Teal.
- Pale blue.
- Lavender and purple.
- Silver and icy neutrals.

Use color gradients, gentle atmospheric depth, restrained highlights, soft shadows, and carefully controlled contrast.

Avoid visual clutter, aggressive neon, excessively dark cyberpunk styling, realistic urban environments, and overly saturated game aesthetics.

The environment should feel calm, premium, imaginative, and intentional.

### Environment: Minimal Geometric Landscape

Build a broad, open geometric landscape with:

- Low-poly hills.
- Carefully spaced geometric crystals or sculptural objects.
- Subtle terrain variations.
- A few supporting environmental details.
- Generous negative space around the road and landmarks.

The composition must remain easy to understand from an elevated overview.

Do not fill every empty area with decorative objects. **Negative space is an important part of the design.**

### Six abstract sculptural landmarks

The portfolio destinations should each be represented by a distinctive low-poly abstract sculpture or geometric installation.

Use identifiable silhouettes and restrained color variations so the six landmarks remain distinguishable from the initial overview camera.

Their designs should be related stylistically without looking like six copies of the same object.

The landmarks represent these destinations, in this logical order:

1. Intro
2. About
3. Skills
4. Projects
5. Experience
6. Contact

Their positions must be deliberately composed along the actual road.

Each landmark should be visually recognizable, directly interactive, and clearly associated with its corresponding destination.

### Shared visual system

Use a consistent design language across the 3D environment and HTML/CSS interface.

The 3D scene provides immersion and emotion. HTML/CSS provides readable, accessible, interactive content.

Do not render important paragraphs, project descriptions, buttons, or navigation labels as textures inside the WebGL scene. Use real HTML elements for these interfaces.

---

## 5. Overall layout and camera composition

### Immersive World layout

The 3D environment occupies the majority of the viewport and remains the primary visual focus.

The interface is layered over the world:

- The destination navigation dock sits near the top of the viewport.
- After the first destination selection, a compact navigation bar remains fixed at the top.
- Floating content panels appear on the left or right according to the scene composition.
- Project detail overlays use the same design system.
- The car and the currently relevant landmark must remain visible throughout the journey.

Use deliberate spacing between the top navigation, landscape, car, landmark, and content panel.

Do not allow the interface to obscure the main subject merely because a panel has been positioned with fixed CSS coordinates.

### Initial camera: Isometric Diorama

The default view is an elevated, slightly downward-facing isometric-style composition, similar to a beautifully art-directed miniature world.

An orthographic camera is an appropriate starting point for this look. A carefully configured perspective camera is also acceptable if it achieves the same miniature-diorama quality.

The opening overview must reveal enough of the road and the six landmark arrangement to establish the overall world.

### Automatic cinematic camera

The camera is fully automatic.

**Do not give the user manual camera orbit or zoom controls.** Do not add OrbitControls for visitor-driven camera manipulation.

The camera must transition smoothly among these states:

1. **Overview:** reveal the world from an elevated isometric angle.
2. **Travel:** move and reframe smoothly to emphasize the car's journey while preserving a readable overview.
3. **Arrival:** settle into a carefully composed view of the destination, nearby landmark, car, and content-panel space.
4. **Return to Intro:** return to the wide overview composition.

Keep the isometric-diorama character even while the camera moves closer during travel.

Camera transitions must not snap abruptly, shake, clip through terrain, or lose sight of the car.

### Adaptive composition

The camera and the scene layout must cooperate with the interface.

For each destination, choose a suitable camera target, framing, and content-panel side.

Use projected object positions, intentional camera framing presets, or another reliable strategy to prevent collisions between:

- The car.
- The active landmark.
- The top navigation.
- The floating content panel.

Avoid unnecessary camera movement while the user reads content.

On mobile, change the camera framing and UI layout rather than simply shrinking the desktop design.

---

## 6. The signature vehicle

Create a distinctive small low-poly car that becomes the visual anchor of the experience.

### Vehicle appearance

- Primary body color: coral/peach.
- Pale blue windows.
- Dark wheels and tires.
- Warm white headlights.
- Subtle, carefully controlled material highlights.

The car must have a readable silhouette from the overview camera, even at a relatively small on-screen size.

Its character should be playful and recognizable without looking like a toy advertisement or racing game.

Use a suitable locally stored GLB/GLTF asset if it substantially improves the result. Otherwise, build a polished procedural model from Three.js geometry.

### Stylized driving animation

The vehicle must follow the actual road curve.

Implement these animations where supported by the selected model:

- Wheels rotate according to the real distance travelled.
- Front wheels steer according to the road's curvature.
- The body makes subtle lean and suspension-like movements around bends.
- Acceleration produces a restrained body response.
- Deceleration and braking produce a subtle brake-light response.
- Arrival includes gentle settling.
- While parked, the car has a minimal idle animation, such as very slight suspension movement and soft lighting.

Avoid excessive bouncing, drifting, spinning, unrealistic sliding, or movement that makes the car feel disconnected from its wheels.

The vehicle must orient consistently with its direction of travel and remain aligned with the road surface.

If the chosen GLB model exposes wheel nodes, animate the actual wheels. If it does not, adapt the model or use a controllable procedural fallback.

Do not allow failure to load a vehicle model to prevent the application from working.

---

## 7. The continuous road and movement system

This is one of the most important engineering requirements.

Create a single continuous, bidirectional road that passes through all six landmarks.

### Road appearance

Use a physical low-poly road surface, with restrained light accents along the edges or route.

When the car moves, subtle light accents can emphasize the road ahead. When it stops, the road returns to its calm ambient appearance.

Avoid excessive neon or racing-track styling.

### Route implementation

Use a genuine continuous curve, such as a suitably configured `CatmullRomCurve3`, together with a road mesh generated along that curve.

The road mesh, landmark positions, car movement, car orientation, and journey progress must all derive from the same route representation.

Suitable implementation techniques include:

- Arc-length-aware curve sampling.
- Normalized route progress.
- Curve tangents for orientation.
- Landmark positions mapped to route parameters.
- Consistent route-distance calculations.

Do not position the car using simple straight-line interpolation between landmark coordinates.

### The six route destinations

Place the landmarks in a visually pleasing continuous sequence:

`Intro → About → Skills → Projects → Experience → Contact`

Assign every landmark a stable ID and a known position along the route.

Do not make each destination a disconnected scene. Do not switch between separate Three.js worlds when navigation changes.

### Bidirectional travel

The vehicle must be able to travel forwards or backwards along the same continuous route.

When navigating backwards:

- Follow the existing road in reverse.
- Preserve continuous position along the curve.
- Handle vehicle orientation and wheel behavior coherently.
- Never teleport to another landmark.
- Never create a shortcut through the landscape.
- Never replace the actual route with a direct line between two landmarks.

### Cinematic travel timing

Movement should have:

1. A gentle departure.
2. Smooth acceleration.
3. A controlled cruising phase.
4. Gradual deceleration near the destination.
5. A soft arrival and settling animation.

Travel time depends on the actual distance along the route.

Short journeys should be relatively quick. Longer journeys may have a more cinematic rhythm, but must not become unnecessarily slow.

Use a tunable travel-duration and speed model with appropriate minimum and maximum bounds. Prioritize route correctness and responsiveness.

### Latest destination wins

Users can change their minds while the car is moving.

Example:

- The car is travelling from Intro towards About.
- The user selects Skills.
- The user then selects Projects.
- The user finally selects Contact.

Contact must become the active target immediately.

The car should continue from its current route position, smoothly adjusting its direction and movement toward the latest target.

Do not queue the previous selections.

Do not restart the entire journey from the previous landmark.

Do not let an old animation or timeout later override the new target.

The destination panel must not display the content of an abandoned target.

The system must remain stable when the user makes many rapid selections.

---

## 8. Navigation and state synchronization

All navigation inputs must use one shared, authoritative navigation system.

The destination menu and clickable 3D landmarks must not have separate, competing navigation logic.

Define a shared typed state model, reducer, controller, or equivalent architecture.

At minimum, represent:

- The current vehicle route position.
- The current/last-arrived landmark.
- The selected target destination.
- Whether the car is travelling or parked.
- Which landmarks have actually been visited.
- The expanded or compact menu state.
- The visible content-panel state.
- The selected project-detail overlay, if any.
- The overall experience phase, such as loading, reveal, idle, travelling, or viewing project details.

Keep the distinction between the vehicle's physical position and the selected destination explicit.

Do not mark the car as having arrived at a landmark while it is still moving towards it.

### Required navigation state transitions

When a new destination is selected:

1. Validate the destination.
2. Close the currently displayed destination content panel as the car departs.
3. Update the selected target immediately.
4. Update the navigation and progress indicators.
5. Move the car along the route towards the new target.
6. Transition the camera with the journey.
7. Keep the destination panel closed during travel.
8. On actual arrival, settle the car and update the current landmark and visited state.
9. Open the corresponding content panel.

Only the destination that is ultimately reached should have its content panel opened.

If the user selects the landmark where the car is already parked, show or restore the correct panel without inventing unnecessary travel.

If a Project Detail Overlay is open, define coherent behavior for closing it, selecting another destination, and preserving navigation consistency.

### Menu and route must never disagree

All of the following must reflect the same underlying state:

- Active navigation item.
- Target destination.
- Physical car position.
- Current landmark.
- Visited landmark markers.
- Progress indicator.
- Visible content panel.
- Camera target.

Treat these as coordinated views of one state model, not independent UI animations.

---

## 9. Expanded navigation dock and compact navbar

### Initial expanded dock

After the initial reveal, show a large floating destination dock near the top of the viewport.

It contains these six destinations:

- Intro
- About
- Skills
- Projects
- Experience
- Contact

Use clear English labels with a soft glassmorphism appearance.

The dock should be visually prominent enough to communicate the interaction model without dominating the 3D world.

### Collapse on the first destination selection

When the visitor makes the first actual destination selection, smoothly transform the expanded dock into a compact fixed navbar.

The transition must be based on interaction state, **not on scrolling**.

The compact navbar remains visible while the visitor explores the world and contains:

- The six destination labels in a compact arrangement.
- A clear active/target state.
- The journey progress indicator.
- A layout that adapts to the available viewport width.

On mobile, use appropriately sized touch targets and a compact layout that keeps every destination accessible.

### Returning to Intro

When the visitor returns to Intro, restore the complete Welcome state:

- The car travels back along the same road.
- The camera returns to the overview.
- The expanded navigation dock reappears.
- The Welcome/Intro content panel returns.

Do not instantly reset the car's position or replace the scene.

---

## 10. Journey Progress Indicator

The progress indicator must communicate the real state of the journey, not merely animate through six steps.

It should reflect:

1. The actual position of the vehicle along the road.
2. Landmarks the visitor has genuinely reached.
3. The landmark where the car is currently parked, if applicable.
4. The currently selected destination.
5. Movement direction when travelling forwards or backwards.

When the car reverses direction, the route-position indicator must update accordingly.

Visited-state information may persist while the visitor explores the world, but it must never be confused with physical route progress.

Use subtle visual differences to distinguish:

- Visited landmarks.
- The current landmark.
- The selected target.
- A target currently being approached.

During transit, display the target as pending arrival instead of claiming that the destination has already been reached.

Keep the indicator compact and visually consistent with the navigation dock.

---

## 11. Direct landmark interaction

All six landmarks must be directly interactive.

### Desktop

- Hovering over an available landmark highlights it subtly.
- Show a compact preview label containing the landmark's name.
- A pointer cursor communicates clickability.
- Clicking a landmark selects it through the same shared navigation function used by the menu.

### Mobile and touch devices

Hover must not be a required interaction.

Tapping a landmark should clearly select it and show a suitable label or other feedback.

Prevent accidental repeated interactions from creating invalid state transitions.

### Visual feedback

Hover and selection effects should feel soft and polished:

- Slight material or emissive change.
- Subtle scale or elevation response where appropriate.
- A clean destination label.
- Consistent active-state styling.

Do not use exaggerated bouncing or disruptive transitions.

A landmark remains a valid navigation target whether it has been visited previously or not.

---

## 12. Floating Content Panels

Every destination has a corresponding HTML/CSS floating content panel.

Panels appear when the vehicle arrives at the destination. They remain closed while the vehicle is travelling elsewhere.

The Intro panel is the initial exception: it appears after the opening reveal, when the car is parked at Intro.

### Adaptive panel placement

Choose the left or right side according to:

- The current camera framing.
- The projected location of the car.
- The active landmark's position.
- The available viewport space.
- The navigation dock's position.

The panel must not obscure the car or its destination when a better composition is available.

Use intentional layout and camera framing rather than relying exclusively on arbitrary absolute positioning.

At arrival, make only the small camera adjustments needed to accommodate the content.

### Panel design

Use the shared soft glassmorphism system:

- Semi-transparent background.
- Restrained backdrop blur.
- Fine light border.
- Soft shadow.
- Rounded corners.
- Excellent typography hierarchy.
- Strong enough text contrast.
- Carefully controlled spacing.

Avoid excessive blur or translucency that makes text difficult to read.

### Responsive behavior

On desktop, the panel generally occupies a side region of the viewport.

On narrow screens, reposition and resize it to fit comfortably, potentially using a bottom-oriented compact panel layout.

The world, vehicle, and destination must remain understandable when the panel is visible.

### Context-specific content layouts

Use an adaptive editorial approach rather than six identical panels with different titles.

- Intro: typography-led introduction with abstract pastel graphics.
- About: concise professional story.
- Skills: visually organized, interactive technology groups.
- Projects: project gallery or cards.
- Experience: compact timeline.
- Contact: focused contact card and clear actions.

Use one shared design system, while allowing each section to have a content-specific layout.

Keep normal destination panels concise and easy to scan.

---

## 13. Project Detail Overlay

At the Projects landmark, users can select a project to open a richer detail overlay without leaving the homepage.

The detail overlay should contain:

- Large project imagery or an appropriate illustrative visual.
- Project title.
- Short overview.
- Main technical challenges or goals.
- Technology stack.
- The sample creator's role.
- Relevant project details.
- Configurable links such as a live demo or source repository.

Close the overlay to return to the Projects panel in its previous navigation context.

Do not reload or navigate away from the homepage just to display project details.

### Overlay behavior

- Open and close with smooth, restrained animation.
- Provide a clearly visible close control.
- Support Escape to close.
- Manage keyboard focus correctly.
- Restore focus to the control that opened the overlay.
- Keep the underlying world intact.
- Avoid allowing background interaction to accidentally trigger another navigation while the modal is active.

The document itself must never scroll. If the detail content cannot reasonably fit the viewport, allow scrolling **inside the project detail content area only**.

That internal scrolling must not move the canvas, page, vehicle, or camera.

Close the overlay before initiating a conflicting destination transition, while preserving a coherent and predictable navigation state.

---

## 14. Portfolio content and data management

You have creative freedom over the final content. Choose realistic English copy, appropriate labels, concise descriptions, and suitable sample calls to action.

The target persona is:

**Software Engineer / Platform & DevOps**

Build sample content around software architecture, backend engineering, cloud infrastructure, CI/CD, automation, and system observability where appropriate.

### Six content destinations

Create complete content for:

1. Intro
2. About
3. Skills
4. Projects
5. Experience
6. Contact

The content should feel cohesive, professionally written, and appropriate for an international software-engineering portfolio.

### Featured project themes

Include three sample projects covering:

- Backend API.
- Cloud Infrastructure.
- CI/CD Automation.

Provide enough detail for the gallery and project-detail overlay to feel convincing as a demonstration.

### Important data-integrity rule

**All sample portfolio information must be clearly identified as demonstration content.**

Do not invent real employment history, verified achievements, real client relationships, or actual production deployments and present them as facts about the user.

Centralize content in a dedicated data module, for example:

`src/data/portfolio.ts`

Adapt the file path to the existing project structure where appropriate.

Use typed data models for destinations, skills, experience items, projects, and contact information.

Keep editable content separate from scene geometry, navigation logic, camera behavior, and UI components.

Where real personal information or URLs have not been provided, use clearly marked placeholders or configurable values.

Do not fabricate working GitHub repositories, live demos, email addresses, or social profiles. A placeholder link must never masquerade as a valid destination.

### Content design

The user has intentionally delegated content decisions to you. Do not request additional personal information.

Make appropriate design decisions for copy, labels, CTA placement, and sample project details while following the visual and interaction requirements above.

---

## 15. Welcome state and initial cinematic reveal

The opening experience should feel deliberate and polished.

Do not require the user to click an Enter button.

### Loading

When resources are loading, display a subtle, styled loading state appropriate to the pastel visual identity.

If progress information is available, show meaningful loading progress.

Handle errors and avoid leaving the user on a blank screen indefinitely.

Do not falsely indicate that a 3D resource has loaded successfully if it has not.

### Cinematic reveal

Once the application is ready, reveal the world through a short cinematic sequence:

1. Soft ambient lighting introduces the landscape.
2. The camera gently reveals the wide isometric world.
3. The coral/peach car becomes visible at Intro.
4. The expanded destination dock appears.
5. The Intro Floating Content Panel enters smoothly.

Keep the reveal short enough that the visitor does not have to wait unnecessarily before interacting.

At the end of the reveal, the state must be fully interactive and consistent.

### Initial settled state

The initial state must have:

- The vehicle parked at Intro.
- The camera in overview mode.
- The expanded destination dock visible.
- The Intro content panel visible.
- The route and all six landmarks established.
- No page scrolling.
- No pending or false destination state.

Use the same Welcome state when the user completes a return journey to Intro.

---

## 16. Ambient animations and sound

### Context-aware ambient animation

The environment should respond to the experience state.

During the initial reveal and vehicle travel, allow restrained ambient details such as:

- Soft crystal illumination.
- Sparse floating particles.
- Very subtle lighting variation.
- Gentle environmental movement.

When the car arrives and the user is reading content, reduce ambient activity significantly.

The car's motion and camera should remain the primary sources of movement.

Use reduced detail or fewer ambient effects when performance requires it.

Respect the user's reduced-motion preference.

### Sound effects

Use subtle, appropriate sound effects only.

Possible cues include:

- A gentle departure sound.
- Very light vehicle movement.
- A subtle arrival or braking cue.
- Small interaction feedback when selecting destinations.

Do not include background music.

Never rely on autoplay that violates browser audio policies. Initialize audio only when permitted and provide an accessible mute control if sound is enabled.

The site must remain fully usable and understandable with sound disabled.

---

## 17. Soft glassmorphism design system

Create a coherent design system for:

- Expanded destination dock.
- Compact navbar.
- Journey progress indicator.
- Floating content panels.
- Project detail overlay.
- Buttons and interactive chips.
- Landmark preview labels.
- Loading and error states.
- Contact actions.

Use:

- Cool pastel colors.
- Semi-transparent surfaces.
- Restrained blur.
- Fine borders.
- Soft shadows.
- Rounded corners.
- Clear typography hierarchy.
- Consistent spacing.
- Refined transition timing.

Keep UI elements visually distinct from the 3D landscape.

Pay particular attention to readability over variable backgrounds. Introduce sufficient opacity or a more solid background when needed.

Ensure all interface states use consistent visual language without forcing every component into an identical layout.

---

## 18. Responsive design

The full experience must work on both desktop and mobile.

### Desktop

Prioritize:

- Large isometric overview.
- Generous spatial composition.
- A readable top navigation dock.
- Adequate space around the car and landmark.
- Floating panels that do not dominate the 3D world.
- Smooth and deliberate camera movement.

### Mobile

Preserve the core experience while adapting its composition.

Implement:

- Responsive camera framing.
- Reduced environmental complexity if necessary.
- A touch-friendly navigation dock.
- Appropriately sized controls.
- Landmark tap interactions.
- Compact content panels.
- Safe-area-aware positioning.
- Reliable viewport sizing.

Use suitable viewport height handling such as dynamic viewport units where supported.

Do not simply scale down the desktop layout until text and controls become unusably small.

The 3D world must remain interactive, and all six destinations must remain accessible.

### Strict viewport rule

The homepage must remain confined to a single viewport.

- No document-level vertical scrolling.
- No document-level horizontal scrolling.
- No hidden full-page sections that require scrolling to navigate.
- Do not use scroll position to drive the car or navigation.

The world may update in place, and overlays may open above it.

Only the Project Detail Overlay may have internal scrolling when necessary.

---

## 19. Accessibility and reduced motion

Implement accessibility as a real requirement rather than a final cosmetic pass.

Include:

- Keyboard navigation.
- Visible focus states.
- Logical tab order.
- Enter and Space activation for appropriate controls.
- Escape to close project overlays.
- Descriptive accessible names and labels.
- Semantic HTML.
- Appropriate modal semantics and focus management.
- Sufficient color contrast.
- Touch targets appropriate for mobile devices.
- Clear active, hover, selected, and disabled states.
- No functionality that depends exclusively on hover.

### Reduced-motion mode

Respect `prefers-reduced-motion`.

When reduced motion is enabled:

- Suppress nonessential ambient movement.
- Remove or shorten cinematic camera transitions.
- Reduce decorative animation.
- Shorten travel duration substantially if appropriate.
- Keep navigation, panels, and progress state synchronized.
- Preserve access to all content.

Reduced-motion mode must not cause the application state to become inconsistent.

If a travel animation is greatly shortened, ensure the car's movement and route state still behave coherently. Avoid unnecessary motion rather than forcing the user to watch a prolonged cinematic sequence.

### WebGL resilience

If WebGL or a 3D resource is unavailable, do not leave the user with a permanently blank homepage.

Provide a clear error/fallback state that preserves access to the six destinations and their content wherever practical.

---

## 20. Engineering architecture and code quality

Use modular components and clearly defined responsibilities.

A possible architecture is shown below. Adapt it to the existing workspace rather than following filenames mechanically.

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    experience/
      PortfolioExperience.tsx
      ExperienceCanvas.tsx
      WorldScene.tsx
      Landscape.tsx
      Road.tsx
      Vehicle.tsx
      Landmark.tsx
      CameraController.tsx
    navigation/
      DestinationDock.tsx
      CompactNavbar.tsx
      JourneyProgress.tsx
    panels/
      FloatingContentPanel.tsx
      ProjectDetailOverlay.tsx
      ContactCard.tsx
    ui/
      LoadingScreen.tsx
      ErrorFallback.tsx
  data/
    portfolio.ts
  lib/
    navigation/
      navigationState.ts
      routeController.ts
    performance/
      qualitySettings.ts
  types/
    portfolio.ts
public/
  models/
  textures/
  audio/
```

This is a reference architecture, not a requirement to create empty folders or unnecessarily split every small component.

Keep state and route calculations testable outside the rendering layer wherever possible.

### Three.js implementation details

- Reuse geometry and materials where appropriate.
- Dispose of GPU resources and event listeners correctly.
- Clean up animation loops, timers, and browser event listeners.
- Avoid creating new vectors, geometries, materials, or large temporary objects on every frame where practical.
- Use frame delta for time-based animation.
- Ensure route movement does not depend on a fixed assumed frame rate.
- Use a shared route model to calculate car position, wheel rotation, and progress.
- Prevent stale animation callbacks from overwriting a newer navigation target.
- Avoid excessive post-processing, large textures, or unnecessary real-time shadows.

Build the scene to support controlled camera movement and robust route-based interaction.

### Avoid unnecessary complexity

Do not add a physics engine merely to simulate a single car travelling on a predetermined road.

Use procedural animation and route mathematics where they provide the most reliable and maintainable solution.

Use React Three Fiber and Drei as tools, not as justification for adding unnecessary abstractions.

---

## 21. Assets and dependencies

Prefer a hybrid asset strategy:

- Use procedural Three.js geometry for terrain, road, landmark sculptures, and supporting environmental shapes.
- Use a carefully selected local GLB/GLTF vehicle or other asset if it materially improves visual quality.
- Keep imported assets inside the project.
- Optimize asset file size.
- Prefer appropriate geometry and texture complexity.
- Use local resources rather than relying on fragile third-party runtime URLs.

If you use external assets:

1. Verify their licensing and usage terms.
2. Record source and attribution requirements where applicable.
3. Store the asset locally.
4. Document important asset sources in a brief README section.
5. Provide a procedural or lightweight fallback when feasible.

Do not rely on paid APIs, remote asset services, or externally hosted assets being available at runtime.

If external assets cannot be obtained reliably, continue with procedural geometry instead of blocking implementation.

Choose dependencies carefully and avoid installing overlapping libraries without a clear reason.

---

## 22. Performance goals and measurement

Balance artistic quality with performance.

Suggested targets:

- Approximately 60 FPS on suitable desktop hardware.
- Approximately 30 FPS or better on suitable mobile hardware.

These are **targets to measure**, not guarantees. Never claim that either target has been achieved unless it was actually tested on the relevant hardware or a clearly identified representative device.

Optimize where appropriate:

- Geometry complexity.
- Texture dimensions and formats.
- Draw calls.
- Material reuse.
- Shadow cost.
- Device pixel ratio.
- Ambient particle count.
- Camera and animation update work.
- Resource loading and caching.

Use reasonable adaptive quality settings when helpful.

Do not automatically build a complex performance-monitoring system that outweighs the application itself.

The initial load should display a useful loading state and then transition into the interactive scene without a prolonged blank screen.

---

## 23. Error handling and edge cases

Test and handle the following situations:

- A GLB/GLTF model fails to load.
- An image or texture fails to load.
- WebGL is unavailable.
- The viewport is resized during travel.
- The device rotates between portrait and landscape.
- A user clicks multiple landmarks quickly.
- The user changes their destination while the car is moving.
- The car is directed to its current destination.
- The user reverses direction along the route.
- A project overlay opens and closes repeatedly.
- Escape is pressed while an overlay is open.
- Reduced-motion settings are enabled.
- A navigation action occurs before the initial reveal has completed.
- Audio is disabled or blocked by the browser.

Handle each situation deliberately.

Do not allow stale timeouts, overlapping animation routines, duplicate event handlers, or independent component state to produce conflicting results.

During loading and cinematic reveal, either handle early user input safely or keep unavailable interactions clearly disabled until the experience is ready.

---

## 24. Required validation and acceptance criteria

Before declaring the implementation complete, test the actual project.

### A. Build and tooling

- Dependencies install successfully using the appropriate package manager.
- The development server starts.
- The application loads without fatal runtime errors.
- Production build succeeds.
- Available linting and type checks succeed, or any existing unrelated failures are clearly identified.
- No unnecessary destructive operations have been performed.

Fix errors introduced by your implementation.

Do not merely list problems for me to fix later.

### B. Visual validation

If browser or preview tools are available, inspect the real rendered application.

Check at least:

- Initial loading and cinematic reveal.
- Full isometric overview.
- Car visibility and scale.
- Six-landmark composition.
- Expanded navigation dock.
- Compact navbar and journey progress.
- Content-panel placement at different destinations.
- Project-detail overlay.
- Desktop and narrow/mobile layouts.

Refine spacing, camera framing, typography, readability, and visual balance based on the actual preview.

A technically successful build is not proof that the interface looks correct.

### C. Navigation and animation validation

Verify the following scenarios:

1. The application opens with the car at Intro and the expanded dock visible after the reveal.
2. Selecting About makes the car travel along the continuous road.
3. The dock smoothly collapses after the first destination selection.
4. The correct panel opens only after arrival.
5. Clicking a landmark and selecting the same destination through the menu produce equivalent behavior.
6. The car can travel forwards and backwards along the same road.
7. Rapid destination changes obey the latest-destination-wins rule.
8. The vehicle never teleports during normal navigation.
9. Route progress reflects the car's actual position.
10. Visited landmarks and target destinations are represented correctly.
11. Returning to Intro restores the wide overview, expanded dock, and Welcome panel.
12. Opening and closing the Project Detail Overlay preserves the underlying world and navigation state.
13. Resizing the viewport does not break the road, camera, vehicle, or controls.
14. Reduced-motion mode remains functional and synchronized.

Where practical, add automated unit or integration tests for route calculations and navigation-state transitions.

Do not substitute a test of a helper function for visual verification of the overall experience when browser testing is available.

### D. Performance validation

Measure performance on the actual devices available to you, or identify representative test devices and browsers clearly.

Record the observed frame rate or relevant profiling results where possible.

If actual mobile testing is unavailable, state that fact. Do not claim the mobile target has been verified based on desktop testing alone.

### E. Honest reporting

Clearly distinguish:

- What was implemented.
- What commands were executed.
- Which build, lint, type-check, or test commands passed.
- Which visual interactions were actually tested.
- What performance measurements were obtained.
- What remains unverified because the required device, browser, or tool was unavailable.

Never claim a test or verification succeeded when it was not performed.

---

## 25. Final execution workflow

Work autonomously through the following process:

**Phase 1 — Inspect**

Inspect the workspace, identify the project structure and preserve all unrelated code and user changes.

**Phase 2 — Implement the core experience**

Establish the continuous 3D world, road, six landmarks, car, camera, and shared navigation state.

**Phase 3 — Implement the interface**

Build the expanded destination dock, compact navbar, journey progress, adaptive floating panels, project-detail overlay, and contact interactions.

**Phase 4 — Polish the experience**

Implement the opening reveal, vehicle animation, context-aware ambient movement, sound effects, responsive layouts, and glassmorphism design system.

**Phase 5 — Validate**

Run the application, inspect the actual interface when possible, test interactions, run appropriate checks, and correct discovered defects.

Do not stop at the end of any phase simply to provide me with a progress report. Continue through completion unless a genuine external blocker makes further work impossible.

Do not ask for approval before routine, reversible implementation choices. When a decision is not specified, choose the option most consistent with the established art direction, architecture, usability, and maintainability.

**Priority order when trade-offs arise:**

1. Correct and synchronized navigation behavior.
2. Strong overall composition and camera framing.
3. Smooth, believable vehicle movement along the actual road.
4. Readable and usable interfaces.
5. Responsive behavior and accessibility.
6. Artistic polish.
7. Performance and maintainability without unnecessary complexity.

These goals should be balanced together rather than optimized in isolation.

---

## 26. Final deliverables

At completion, provide:

1. A concise summary of the implemented experience.
2. The project location in the workspace.
3. The exact command to start the development server.
4. The important files or components and where portfolio content can be customized.
5. The results of build, lint, type-check, and tests that were actually run.
6. A brief account of browser/preview validation and performance measurements, including anything not tested.
7. Any asset sources, license notes, or necessary setup steps.
8. Any remaining limitations or genuine blockers.

The finished homepage should feel like **a complete interactive low-poly world with one continuous journey**, not a generic portfolio template and not a collection of disconnected Three.js effects.

Begin by inspecting the workspace, then implement the project and carry the work through validation and final delivery.
