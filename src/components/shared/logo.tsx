import { Link } from '@tanstack/react-router'

const BrandLogo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 no-underline transition-opacity hover:opacity-90"
    >
      <img
        src="/logo.png"
        alt="NodeSpace Logo"
        className="h-10 w-auto object-contain"
      />
    </Link>
  )
}

export default BrandLogo
