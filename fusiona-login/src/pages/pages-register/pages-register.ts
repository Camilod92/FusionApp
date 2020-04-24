import { TokenDatos } from "./../../providers/api/api";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { passValidator } from "./Validators";
import { ApiProvider } from "../../providers/api/api";
/**
 * Generated class for the PagesRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pages-register",
  templateUrl: "pages-register.html",
})
export class PagesRegisterPage {
  registerGroup: FormGroup;
  name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  repass: AbstractControl;
  loading = false;
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
    public formbuilder: FormBuilder,
    private api: ApiProvider
  ) {
    this.registerGroup = formbuilder.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      last_name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      repass: ["", [Validators.required, passValidator]],
    });

    this.registerGroup.controls.password.valueChanges.subscribe((x) =>
      this.registerGroup.controls.repass.updateValueAndValidity()
    );

    this.name = this.registerGroup.controls["name"];
    this.last_name = this.registerGroup.controls["last_name"];
    this.email = this.registerGroup.controls["email"];
    this.password = this.registerGroup.controls["password"];
    this.repass = this.registerGroup.controls["repass"];
  }

  ionViewDidLoad() {
    this.loading = false;
  }

  register() {
    this.loading = true;
    this.credentials = {
      id: 0,
      first_name: this.name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      password: this.password.value,
    };
    this.api.registerUser(this.credentials).subscribe((data) => {
      if (data.error) {
        alert("Correo ya esta registrado");
        this.loading = false;
      } else {
        alert("Registrado exitosamente");
        this.navCtrl.setRoot("PagesLoginPage");
      }
    });
  }

  back() {
    this.navCtrl.setRoot("PagesLoginPage");
  }
}
