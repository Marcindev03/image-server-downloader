import async from "async";

export class Queue {
  private static instance: Queue;
  private queue = async.queue(async (task: () => Promise<void>, callback) => {
    await task();
    callback();
  });

  private constructor() {}

  public static getInstance(): Queue {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }

    return Queue.instance;
  }

  public pushTask(task: () => Promise<void>) {
    this.queue.push(task);
  }
}
