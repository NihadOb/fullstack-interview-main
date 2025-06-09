import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

export function TransformDate(format = 'YYYY-MM-DD') {
  return Transform(({ value }) =>
    value ? dayjs(value).format(format) : value,
  );
}
