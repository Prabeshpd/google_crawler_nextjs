/**
 * @jest-environment node
 */

import { Queue } from 'bullmq';
import { ModuleMocker } from 'jest-mock';

import { BullQueue } from './worker';

function createMockInstance(cl: any) {
  const mocker = new ModuleMocker(global);
  const mockMetadata = mocker.getMetadata(cl);

  if (mockMetadata) {
    const Mock = mocker.generateFromMetadata(mockMetadata);
    return new Mock();
  }
}

describe('BullQueue():', () => {
  let mockQueue: any;
  beforeEach(() => {
    mockQueue = createMockInstance(Queue);
  });

  it('adds new job on calling the add implementation for BullQueue class', async () => {
    const bullMq = new BullQueue(mockQueue);
    await bullMq.addJob({ name: 'asfd', opts: {}, data: {} });

    expect(mockQueue.add).toHaveBeenCalledWith('asfd', {}, {});
  });

  it('adds multiple jobs on calling the bulk add for BullQueue', async () => {
    const bullMq = new BullQueue(mockQueue);
    bullMq.addBulkJobs([{ name: 'asfd', opts: {}, data: {} }]);

    expect(mockQueue.addBulk).toHaveBeenCalledWith([{ name: 'asfd', opts: {}, data: {} }]);
  });

  it('drains the queue of job on calling the clear jobs for BullQueue', async () => {
    const bullMq = new BullQueue(mockQueue);
    bullMq.clearJobs();

    expect(mockQueue.drain).toHaveBeenCalledWith();
  });
});
