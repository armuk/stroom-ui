export interface ThemeInterface {
  // General
  backgroundColor: string;
  textColor: string;
  textColor_deemphasised: string;
  selectedColor: string;
  focussedColor: string;
  hoverColor: string;
  raisedLow_backgroundColor: string;
  raisedHigh_backgroundColor: string;
  raisedHigh_selectedBackgroundColor: string;
  raisedElement_border: string;
  border: string;
  // Specific
  sidebar_headerColor: string;
  header_iconColor: string;
  dropdown_backgroundColor: string;
  dropdown_border: string;
  dropdown_hoverColor: string;
  breadcrumb_divider__color: string;
  breadcrumb_section__color: string;
  breadcrumb_sectionActive__color: string;
  iconButton_border: string;
  iconButton_backgroundColor: string;
  iconButton_backgroundColor_hover: string;
  iconButton_color: string;
  iconButton_color_hover: string;
  scrollbar_trackColor: string;
  scrollbar_thumbColor: string;
  smallSpacing: string;
  animationDuration: string;
}

export const ThemeDefaults = {
  smallSpacing: "1rem",
  animationDuration: "0.3s"
};
