import type {
  TargetAndTransition,
  Transition,
  Variants,
  ViewportOptions,
} from "framer-motion";

const premiumEase: Transition["ease"] = [0.22, 1, 0.36, 1];

const baseRevealTransition: Transition = {
  duration: 0.55,
  ease: premiumEase,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseRevealTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: premiumEase,
    },
  },
};

type StaggerContainerOptions = {
  delayChildren?: number;
  staggerChildren?: number;
};

export function createStaggerContainer(
  options: StaggerContainerOptions = {}
): Variants {
  const { delayChildren = 0.04, staggerChildren = 0.08 } = options;

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export const staggerContainer: Variants = createStaggerContainer();

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: premiumEase,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: premiumEase,
    },
  },
};

export const mobileMenuBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: premiumEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.16,
      ease: premiumEase,
    },
  },
};

export const mobileMenuPanel: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: premiumEase,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    x: 16,
    transition: {
      duration: 0.2,
      ease: premiumEase,
      when: "afterChildren",
    },
  },
};

export const mobileMenuList: Variants = createStaggerContainer({
  delayChildren: 0.06,
  staggerChildren: 0.05,
});

export const sectionViewport: ViewportOptions = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -10% 0px",
};

export function withDelay(variant: Variants, delay = 0): Variants {
  if (delay === 0) {
    return variant;
  }

  const visibleVariant = variant.visible as TargetAndTransition;

  return {
    ...variant,
    visible: {
      ...visibleVariant,
      transition: {
        ...(visibleVariant.transition ?? {}),
        delay,
      },
    },
  };
}
