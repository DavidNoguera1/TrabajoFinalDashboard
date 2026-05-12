export const toIsoDate = (value: string | Date): string => {
  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Fecha invalida: ${String(value)}`);
  }

  return parsed.toISOString().slice(0, 10);
};

const buildIsoDate = (year: number, month: number, day: number): string => {
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() + 1 !== month ||
    candidate.getUTCDate() !== day
  ) {
    throw new Error(`Fecha invalida: ${day}/${month}/${year}`);
  }

  return candidate.toISOString().slice(0, 10);
};

export const parseFlexibleIsoDate = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const raw = value.trim();
  if (!raw) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return toIsoDate(raw);
  }

  const slash = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) {
    return buildIsoDate(Number(slash[3]), Number(slash[2]), Number(slash[1]));
  }

  const dash = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dash) {
    const first = Number(dash[1]);
    const second = Number(dash[2]);
    const year = Number(dash[3]);

    // Soporta DD-MM-YYYY y MM-DD-YYYY.
    if (first > 12) {
      return buildIsoDate(year, second, first);
    }

    if (second > 12) {
      return buildIsoDate(year, first, second);
    }

    return buildIsoDate(year, second, first);
  }

  return toIsoDate(raw);
};

export const parseFlexibleTime = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace('a.m', 'am')
    .replace('p.m', 'pm');

  if (!normalized) {
    return null;
  }

  const plain = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (plain) {
    const hour = Number(plain[1]);
    const minute = Number(plain[2]);
    const second = Number(plain[3] || 0);

    if (hour > 23 || minute > 59 || second > 59) {
      return null;
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  }

  const ampm = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(am|pm)$/);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2]);
    const second = Number(ampm[3] || 0);
    const marker = ampm[4];

    if (hour < 1 || hour > 12 || minute > 59 || second > 59) {
      return null;
    }

    if (marker === 'am') {
      hour = hour === 12 ? 0 : hour;
    } else {
      hour = hour === 12 ? 12 : hour + 12;
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  }

  return null;
};

const toSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map((part) => Number(part));
  return hours * 3600 + minutes * 60 + seconds;
};

export const calculateDurationMinutes = (
  startTime: string | null | undefined,
  endTime: string | null | undefined
): number | null => {
  if (!startTime || !endTime) {
    return null;
  }

  const start = toSeconds(startTime);
  const end = toSeconds(endTime);
  const diff = end - start;

  if (diff < 0) {
    return null;
  }

  return Math.floor(diff / 60);
};

export const inferPeriodoAcademico = (isoDate: string): string => {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;

  return month <= 6 ? `${year}-1` : `${year}-2`;
};
