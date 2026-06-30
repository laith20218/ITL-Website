// ITL Logo - uses the uploaded PNG logo
import Image from 'next/image'

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="ITL Logo"
      width={40}
      height={40}
      className={className}
      priority
    />
  )
}
