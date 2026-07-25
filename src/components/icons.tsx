import Svg, { Path, Circle, Rect } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function HomeIcon({ size = 24, color = '#171718', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-4.5v-6h-6v6H4.5a1 1 0 0 1-1-1z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 24, color = '#171718', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M20 20l-3.6-3.6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ShelfIcon({ size = 24, color = '#171718', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 4v16M10 4v16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M15 5.5l4.5 1.2v13l-4.5-1.2z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 16, color = '#171718', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 22, color = '#171718', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MoreDotsIcon({ size = 20, color = '#171718' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={5} cy={12} r={1.9} fill={color} />
      <Circle cx={12} cy={12} r={1.9} fill={color} />
      <Circle cx={19} cy={12} r={1.9} fill={color} />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color = '#171718', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function HeartIcon({ size = 22, color = '#171718', filled = false }: IconProps & { filled?: boolean }) {
  const d = 'M12 21s-7.4-4.6-9.9-8.9C.6 8.7 2 5.2 5.4 5.2c2.3 0 3.8 1.4 6.6 4 2.7-2.6 4.2-4 6.5-4 3.4 0 4.8 3.5 3.3 6.9C19.4 16.4 12 21 12 21z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} fill={filled ? color : 'none'} stroke={color} strokeWidth={filled ? 0 : 1.8} />
    </Svg>
  );
}

export function PlayIcon({ size = 18, color = '#171718' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 4.5l13 7.5-13 7.5z" fill={color} />
    </Svg>
  );
}

export function PauseIcon({ size = 18, color = '#171718' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={6} y={5} width={4} height={14} fill={color} />
      <Rect x={14} y={5} width={4} height={14} fill={color} />
    </Svg>
  );
}

export function PrevIcon({ size = 30, color = '#171718' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M16 5.5l-11 6.5 11 6.5z" fill={color} />
      <Rect x={16.4} y={5} width={2.6} height={14} fill={color} />
    </Svg>
  );
}

export function NextIcon({ size = 30, color = '#171718' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 5.5l11 6.5-11 6.5z" fill={color} />
      <Rect x={5} y={5} width={2.6} height={14} fill={color} />
    </Svg>
  );
}

export function ShuffleIcon({ size = 24, color = '#171718', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16 3h5v5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 20 21 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M21 16v5h-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 15l6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M4 4l6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function RepeatIcon({ size = 24, color = '#171718', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 2l3 3-3 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 11.5V10a4 4 0 0 1 4-4h12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 22l-3-3 3-3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 12.5V14a4 4 0 0 1-4 4H4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MusicNoteIcon({ size = 20, color = '#171718' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={8} cy={17} r={3.2} fill={color} />
      <Rect x={10.8} y={4} width={1.8} height={13.4} fill={color} />
      <Path d="M10.8 4l7 2v5l-7-2z" fill={color} />
    </Svg>
  );
}

export function CheckIcon({ size = 16, color = '#171718', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TrashIcon({ size = 20, color = '#171718', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7M6 7l1 13a2 2 0 0 0 2 1.9h6a2 2 0 0 0 2-1.9l1-13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon({ size = 16, color = '#171718', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 5l14 14M19 5L5 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CastIcon({ size = 15, color = '#171718', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={13} rx={1} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 21h8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
