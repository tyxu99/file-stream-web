import GenerateFileId from "@/components/generateFileId";
import Upload from "@/components/upload";
import { Observable } from "rxjs";

const Home = () => {
  const onRxObservable = () => {
    const observable = new Observable((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
      }, 1000);
    });

    console.log("before subscribe");

    observable.subscribe({
      next(x) {
        console.log("get value", x);
      },
      error(err) {
        console.log("sth wrong", err);
      },
      complete() {
        console.log("done");
      },
    });

    console.log("after subscribe");
  };

  return (
    <>
      <div onClick={onRxObservable}>Observable</div>
      <GenerateFileId />
      <Upload />
    </>
  );
};

export default Home;
