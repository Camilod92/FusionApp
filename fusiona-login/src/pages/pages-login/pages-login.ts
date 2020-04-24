import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TokenDatos, ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the PagesLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pages-login",
  templateUrl: "pages-login.html",
})
export class PagesLoginPage {
  username: string;
  password: string;
  credentials: TokenDatos = {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider
  ) {}

  ionViewDidLoad() {}

  login() {
    this.credentials = {
      id: 0,
      first_name: "",
      last_name: "",
      email: this.username,
      password: this.password,
    };
    //this.navCtrl.setRoot("PagesHomePage");
    this.api.login(this.credentials).subscribe((data) => {
      if (data.error) {
        alert("Datos incorrectos intentelo nuevamente");
      } else {
        this.navCtrl.setRoot("PagesHomePage");
      }
    });
  }

  goToRegister() {
    this.navCtrl.push("PagesRegisterPage");
  }
}
