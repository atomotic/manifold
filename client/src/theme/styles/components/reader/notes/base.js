import {
  buttonUnstyled,
  defaultTransitionProps,
  drawerPadding
} from "theme/styles/mixins";

export default `
  .button-notes {
    ${buttonUnstyled}
    height: 100%;
    color: var(--color-base-neutral50);
    transition: background-color ${defaultTransitionProps};

    &.button-active {
      background-color: var(--color-base-neutral10);
    }
  }

  .notes-drawer {
    @keyframes drawerOverlayFade {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    .drawer-overlay {
      opacity: 0;
      animation: drawerOverlayFade ${defaultTransitionProps} forwards;

      .panel-visible & {
        opacity: 1;
      }

      .panel-exit & {
        opaicty: 1;
        animation: drawerOverlayFade ${defaultTransitionProps} backwards;
      }

      .panel-exit.panel-exit-active & {
        opacity: 0;
      }
    }

    @keyframes notesSlide {
      from {
        transform: translateX(100%);
      }

      to {
        transform: translateX(0);
      }
    }

    .drawer {
      .panel-visible & {
        animation: notesSlide ${defaultTransitionProps} forwards;
      }

      .panel-exit & {
        transform: translateX(0);

        animation: notesSlide ${defaultTransitionProps} backwards;
      }

      .panel-exit.panel-exit-active & {
        transform: translateX(100%);
      }
    }

    .drawer-bar {
      ${drawerPadding("padding-right", "narrow")}
      ${drawerPadding("padding-left", "narrow")}
    }
  }
`;