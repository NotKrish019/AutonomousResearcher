import { Annotation } from '@langchain/langgraph';

export const ResearchStateAnnotation = Annotation.Root({
  topic: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => '',
  }),
  depth: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => 'deep',
  }),
  subtopics: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => [],
  }),
  currentSubtopicIndex: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => 0,
  }),
  researchNotes: Annotation({
    value: (x, y) => (y !== undefined ? [...x, ...y] : x),
    default: () => [],
  }),
  reflectionCount: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => 0,
  }),
  finalReport: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => '',
  }),
  status: Annotation({
    value: (x, y) => (y !== undefined ? y : x),
    default: () => 'planning',
  }),
  logs: Annotation({
    value: (x, y) => (y !== undefined ? [...x, ...y] : x),
    default: () => [],
  }),
});
