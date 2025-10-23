export const COLORS = {
  primary: "#AF8639",
  textBase: "#000",
  bgLayout: "#FFF",
  link: "#AF8639",
  bgContainer: "#F1E4CB",
  primaryText: "#00000099",
  bgBase: "#FFF9ED",
  borderColor: "#f0d270ff",
  bgSelected: "#e9b509ff",
  borderHoverColor: "#dfb427ff",
  bgHoverColor: "#e8d184ff",
};

export const BORDER_RADIUS = {
  lg: 20,
  sm: 8,
};

export const FONT_SIZES = {
  heading1: 40,
  heading2: 30,
  heading3: 24,
  heading4: 20,
  heading5: 18,
  heading6: 16,
  sm: 12,
  lg: 14,
  xlg: 16,
  xxl: 18,
  xxxl: 20,
};

export const FONT_WEIGHT = {
  lg: 500,
};

export const descending = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="sort-down"
    className="svg-inline--fa fa-sort-down fa-fw"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    style={{ opacity: 0.8, paddingTop: "3px", width: "20px", height: "20px" }}
  >
    <path
      fill="currentColor"
      d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"
    ></path>
  </svg>
);

export const ascending = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="sort-up"
    className="svg-inline--fa fa-sort-up fa-fw"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    style={{ opacity: 0.8, paddingTop: "3px", width: "20px", height: "20px" }}
  >
    <path
      fill="currentColor"
      d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"
    ></path>
  </svg>
);

export const noSorting = (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="sort"
    className="svg-inline--fa fa-sort fa-fw"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    style={{ opacity: 0.3, paddingTop: "3px", width: "20px", height: "20px" }}
  >
    <path
      fill="currentColor"
      d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"
    ></path>
  </svg>
);
