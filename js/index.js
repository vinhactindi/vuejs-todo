const TODO_STORAGE = "todos";
const STORAGE = window.localStorage;

Vue.component("todo-form", {
  template: `
    <form @submit="submitAndClear(text)" action="#">
      <input type="text" v-model="text" placeholder="入力してください">
      <input class="button" type="submit" value="保存する" />
    </form>
  `,
  data: function () {
    return {
      id: "",
      text: "",
      done: false,
    };
  },
  beforeMount() {
    this.id = this.$props.id;
    this.text = this.$props.text;
  },
  watch: {
    text: function (text) {
      this.error = text;
    },
  },
  props: ["id", "text", "done", "submit"],
  methods: {
    submitAndClear() {
      if (!this.text) return;

      this.$props.submit({
        id: this.id,
        text: this.text,
        done: this.done,
      });
      this.text = "";
    },
  },
});

Vue.component("todo-li", {
  template: `
    <li class="todo-item" :key="todo.id">
      <todo-form v-if="editing == todo.id" :submit="save" :id="todo.id" :text="todo.text"></todo-form>

      <span v-else>
        <input
          type="checkbox"
          :name="todo.id"
          :id="todo.id"
          :checked="todo.done"
          @change="toggle(todo, $event)"
        />
        <span>{{ todo.text }}<span/>
        <span class="todo-actions">
          <button class="button button-small danger-bg" type="button" @click="remove(todo)">削除</button>
          <button class="button button-small warning-bg" type="button" @click="edit(todo)">編集</button>
        </span>
      </span>
    </li>
  `,
  props: ["todo", "toggle", "remove", "save", "edit", "editing"],
});

new Vue({
  el: "#app",
  data: {
    todos: [],
    editing: "",
  },
  methods: {
    doneTodos: function () {
      return this.todos.filter(({ done }) => done);
    },
    undoneTodos: function () {
      return this.todos.filter(({ done }) => !done);
    },
    changeEditing: function (todo) {
      this.editing = todo.id;
    },
    toggleTodo: function (todo) {
      todo.done = !todo.done;
    },
    saveTodo: function (todo) {
      if (!todo.text) return;

      if (!todo.id) {
        this.todos.push({ id: uuidv4(), text: todo.text, done: false });
      } else {
        const t = this.todos.find((v) => v.id === todo.id);

        t.text = todo.text;
      }

      this.editing = "";
    },
    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },
  },
  mounted() {
    if (STORAGE.getItem(TODO_STORAGE)) {
      try {
        this.todos = JSON.parse(STORAGE.getItem(TODO_STORAGE));
      } catch (e) {
        STORAGE.removeItem(TODO_STORAGE);
      }
    } else {
      this.todos = [
        { id: 1, text: "hello world", done: false },
        { id: 2, text: "hi this's vinh", done: false },
        { id: 3, text: "lorem ipsum", done: true },
        { id: 4, text: "so you are the one", done: false },
      ];
    }
  },
  watch: {
    todos: {
      handler(todos) {
        const parsed = JSON.stringify(todos);

        STORAGE.setItem(TODO_STORAGE, parsed);
      },
      deep: true,
    },
  },
});
