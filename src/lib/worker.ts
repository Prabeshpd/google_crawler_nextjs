import { Queue, Worker, Job } from 'bullmq';

interface IWorker<T> {
  worker: T;
  onCompleted: (onCompleted: (job: Job, returnValue: unknown) => void) => void;
  onFailed: (onFailed: (job: Job | undefined, error: Error) => void) => void;
  onProgress: (onProgress: (job: Job, progressNumber: unknown) => void) => void;
}

interface IJob {
  name: string;
  data: { [key: string]: unknown };
  opts: { [key: string]: unknown };
}

interface IQueue<T> {
  addJob: (job: IJob) => void;
  queue: T;
  addBulkJobs: (job: IJob[]) => void;
  clearJobs: () => void;
}

export class BullQueue implements IQueue<Queue> {
  queue: Queue;

  constructor(queue: Queue) {
    this.queue = queue;
  }

  addJob(job: IJob) {
    this.queue.add(job.name, job.data, job.opts);
  }

  addBulkJobs(jobs: IJob[]) {
    this.queue.addBulk(jobs);
  }

  clearJobs() {
    this.queue.drain();
  }
}

export class BullWorker implements IWorker<Worker> {
  worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  onFailed(onFailed: (job: Job | undefined, error: Error) => void) {
    this.worker.on('failed', onFailed);
  }

  onCompleted(onCompleted: (job: Job, returnValue: unknown) => void) {
    this.worker.on('completed', onCompleted);
  }

  onProgress(onProgress: (job: Job, progressNumber: unknown) => void) {
    this.worker.on('progress', onProgress);
  }
}
