import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalExceptionFilter } from './gloabl-exception.filter';
import ErrorResponseDto from '../dtos/error-response.dto';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let httpAdapter: { reply: jest.Mock };
  let httpAdapterHost: HttpAdapterHost;
  let mockHost: ArgumentsHost;
  let mockGetResponse: jest.Mock;

  beforeEach(() => {
    httpAdapter = { reply: jest.fn() };
    httpAdapterHost = { httpAdapter } as any;
    filter = new GlobalExceptionFilter(httpAdapterHost);

    mockGetResponse = jest.fn();
    mockHost = {
      switchToHttp: () => ({
        getResponse: mockGetResponse,
      }),
    } as any;
  });

  it('should handle HttpException with string message', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      mockGetResponse(),
      expect.objectContaining({
        error: 'Internal Server Error',
        message: 'Forbidden',
        details: [],
      }),
      HttpStatus.FORBIDDEN,
    );
  });

  it('should handle HttpException with object message (array)', () => {
    const exception = new HttpException(
      { message: ['Error1', 'Error2'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      mockGetResponse(),
      expect.objectContaining({
        error: 'Internal Server Error',
        message: 'Error1, Error2',
        details: ['Error1', 'Error2'],
      }),
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should handle HttpException with object message (string)', () => {
    const exception = new HttpException(
      { message: 'Single error' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      mockGetResponse(),
      expect.objectContaining({
        error: 'Internal Server Error',
        message: 'Single error',
        details: [],
      }),
      HttpStatus.BAD_REQUEST,
    );
  });

  it('should handle unknown exception', () => {
    const exception = new Error('Unexpected error');

    filter.catch(exception, mockHost);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      mockGetResponse(),
      expect.objectContaining({
        error: 'Internal Server Error',
        message: '',
        details: [],
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
