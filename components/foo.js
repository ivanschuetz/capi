import styles from "./foo.module.sass";

export const Foo = () => {
  return (
    <div>
      <section id={styles.container}>
        <div>{"hellooo"}</div>
      </section>
    </div>
  );
};
