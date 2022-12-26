import async from "async";

export class Queue {
  private queue = async.queue(async (task: () => Promise<void>, callback) => {
    await task();
    callback();
  });

  protected pushTask(task: () => Promise<void>) {
    this.queue.push(task);
  }
}
