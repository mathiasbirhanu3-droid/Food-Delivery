// Generic button. Use `as={Link}` to render router links with button styling.
export default function Button({
  variant = "primary",
  size = "md",
  as: Tag = "button",
  className = "",
  ...props
}) {
  return <Tag className={`btn btn--${variant} btn--${size} ${className}`} {...props} />;
}