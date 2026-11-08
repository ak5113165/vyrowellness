// How a VYRO project comes together — shared by the Home, Saunas and
// Wellness Spaces pages so the promise is worded the same everywhere.
// Wording matches what the site already states; don't add service claims
// (timelines, warranties, AMC) here until they are confirmed.

export const consultationSteps = [
  {
    n: "01",
    title: "Space Assessment",
    copy: "We review your floor plan, electrical layout and ventilation requirements.",
  },
  {
    n: "02",
    title: "Bespoke Specification",
    copy: "Dimensions, timber and finishes tailored to your architecture.",
  },
  {
    n: "03",
    title: "White-Glove Installation",
    copy: "Delivery, installation, commissioning and ongoing support in India.",
  },
] as const;
