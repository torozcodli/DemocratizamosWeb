import React, { useId } from 'react';

type Props = {
  className?: string;
};

export function BgPixelBlocks({ className }: Props) {
  const rid = useId();
  const clipId = `clip_${rid.replace(/:/g, '')}`;

  return (
    <svg
      className={className}
      width="176"
      height="85"
      viewBox="0 0 176 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* OJO: en JSX es clipPath, NO clip-path */}
      <g clipPath={`url(#${clipId})`}>
        <g opacity="0.85">
          <path d="M22.0799 0H15.1499V18.26H22.0799V0Z" fill="#E9EEFF" />
          <path d="M67.5399 0H60.6099V18.26H67.5399V0Z" fill="#E9EEFF" />
          <path d="M6.93 31.97H0V50.23H6.93V31.97Z" fill="#E9EEFF" />
          <path d="M6.93 66.45H0V84.71H6.93V66.45Z" fill="#E9EEFF" />
          <path d="M22.0799 31.97H15.1499V50.23H22.0799V31.97Z" fill="#E9EEFF" />
          <path d="M52.39 31.97H45.46V50.23H52.39V31.97Z" fill="#E9EEFF" />
          <path d="M67.5399 31.97H60.6099V50.23H67.5399V31.97Z" fill="#E9EEFF" />
          <path d="M67.5399 66.45H60.6099V84.71H67.5399V66.45Z" fill="#E9EEFF" />
          <path d="M118.48 31.97H111.55V50.23H118.48V31.97Z" fill="#E9EEFF" />
          <path d="M103.33 0H96.3999V18.26H103.33V0Z" fill="#E9EEFF" />
          <path d="M118.48 0H111.55V18.26H118.48V0Z" fill="#E9EEFF" />
          <path d="M133.63 0H126.7V18.26H133.63V0Z" fill="#E9EEFF" />
          <path d="M175.19 0H168.26V18.26H175.19V0Z" fill="#E9EEFF" />
        </g>
      </g>

      <defs>
        <clipPath id={clipId}>
          <rect width="175.19" height="84.72" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}


