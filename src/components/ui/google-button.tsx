'use client';
import Image from 'next/image';
import google from '@/assets/brand/google/google-light-text-pill.svg';
export function GoogleButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="hit-area flex h-10 w-full cursor-pointer items-center justify-center disabled:opacity-50"
    >
      <Image src={google} alt="" width={180} height={40} unoptimized />
    </button>
  );
}
