const axios = require('axios').default;

const Login = class {
  constructor(body) {
    this.body = body;
  }

  run() {
    this.body.innerHTML = this.render();
    this.onClickButton();
  }

  onClickButton() {
    const formEl = document.querySelector('form');

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();

      const dataForm = new FormData(formEl);
      const data = Object.fromEntries(dataForm);

      axios.post(`http://127.0.0.1:3000/login`, data, { withCredentials: true })
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          window.location.href = '/admin';
        }).catch((error) => {
          console.error('Erreur de connexion:', error);
          alert('Erreur de connexion - Vérifiez vos identifiants');
        });
    });
  }

  renderForm() {
    return `
      <form>
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="fa-solid fa-user"></i>
          </span>
          <input name="name" type="text" class="form-control" placeholder="hello world" required>
        </div>
          <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="fa-solid fa-lock"></i>
          </span>
          <input name="password" type="password" class="form-control" required>
        </div>
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-paper-plane"></i>
            Envoyer
          </button>
        </div>
      </form>
    `;
  }

  render() {
    return `
        <main class="container" style="margin-top:30vh;">
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                  ${this.renderForm()}
                </div>
                <div class="col-3"></div>
            </div>
        </main>
    `;
  }
};

export default Login;
