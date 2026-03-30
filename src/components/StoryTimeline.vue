<script setup>
import { projects } from '../data/projects.js'

const props = defineProps({
  milestones: {
    type: Array,
    required: true,
  },
})

/**
 * Returns the project objects for a list of project IDs.
 * Filters out any IDs not found in the projects data.
 */
function getProjects(projectIds) {
  return projectIds
    .map(id => projects.find(p => p.id === id))
    .filter(Boolean)
}
</script>

<template>
  <div class="timeline">
    <div
      v-for="(milestone, index) in milestones"
      :key="index"
      class="milestone"
      data-reveal
      :style="{ transitionDelay: (index * 0.12) + 's' }"
    >
      <!-- The dot on the line -->
      <div class="milestone-dot"></div>

      <!-- Content block -->
      <div class="milestone-content">
        <span class="milestone-date">
          {{ milestone.year }} {{ milestone.quarter }}
        </span>
        <h3 class="milestone-title">{{ milestone.title }}</h3>
        <p class="milestone-desc">{{ milestone.description }}</p>

        <!-- Project color dots -->
        <div v-if="milestone.projectIds && milestone.projectIds.length" class="project-dots">
          <span
            v-for="project in getProjects(milestone.projectIds)"
            :key="project.id"
            class="project-dot"
            :style="{ background: project.brand.primary }"
            :title="project.name"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  padding-left: 2.5rem;
}

/* The vertical line running down the left */
.timeline::before {
  content: '';
  position: absolute;
  left: 0.55rem;
  top: 0.3rem;
  bottom: 0.3rem;
  width: 2px;
  background: var(--accent);
  opacity: 0.4;
}

/* ─── Milestone ─── */
.milestone {
  position: relative;
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.milestone[data-revealed='true'] {
  opacity: 1;
  transform: translateY(0);
}

.milestone:last-child {
  margin-bottom: 0;
}

/* Circle on the timeline line */
.milestone-dot {
  position: absolute;
  left: -2.5rem;
  /* Center dot on the 2px line: (0.55rem * 16 = ~8.8px) - radius(6px) ≈ -2.5rem + offset */
  /* The line is at left: 0.55rem from .timeline, so from .milestone (which has padding-left: 2.5rem)
     the line is at: -(2.5rem - 0.55rem) = -1.95rem from the milestone left edge.
     We position the dot centered on that. */
  top: 0.2rem;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
  /* Shift right to center on the 2px line at left: 0.55rem */
  /* line absolute pos = 0.55rem from .timeline left edge
     .milestone has no extra offset, but is inside .timeline with padding-left: 2.5rem
     So the line from milestone's coordinate space is at -(2.5rem - 0.55rem) = -1.95rem
     Dot is 12px wide, center at -1.95rem + 6px = -calc(1.95rem - 6px) */
  transform: translateX(calc(2.5rem - 0.55rem - 6px));
  box-shadow: 0 0 0 3px var(--accent-bg), 0 0 0 4px var(--accent);
}

/* ─── Content ─── */
.milestone-content {
  background: var(--accent-bg);
  border: 2px solid var(--border);
  padding: 1.25rem 1.5rem;
  border-radius: 2px;
}

.milestone-date {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--accent);
  display: block;
  margin-bottom: 0.4rem;
}

.milestone-title {
  font-family: 'Space Grotesk', var(--sans-font);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--text);
  letter-spacing: -0.01em;
}

.milestone-desc {
  font-family: 'Space Mono', var(--mono-font);
  font-size: 0.72rem;
  color: var(--text-light);
  line-height: 1.65;
  margin: 0 0 0.75rem;
}

/* ─── Project color dots ─── */
.project-dots {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.project-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.85;
  flex-shrink: 0;
}

/* ─── Mobile ─── */
@media (max-width: 600px) {
  .timeline {
    padding-left: 1.75rem;
  }

  .timeline::before {
    left: 0.35rem;
  }

  .milestone-dot {
    transform: translateX(calc(1.75rem - 0.35rem - 6px));
  }

  .milestone-content {
    padding: 1rem 1rem;
  }

  .milestone-date {
    font-size: 0.65rem;
  }

  .milestone-title {
    font-size: 1rem;
  }

  .milestone-desc {
    font-size: 0.68rem;
  }
}
</style>
