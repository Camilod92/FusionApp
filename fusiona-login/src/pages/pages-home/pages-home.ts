import { UserProfile, ApiProvider } from "./../../providers/api/api";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Subject } from "rxjs";

@IonicPage()
@Component({
  selector: "page-pages-home",
  templateUrl: "pages-home.html",
})
export class PagesHomePage {
  details: UserProfile;

  private unsubscribe = new Subject();

  interval: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider
  ) {}

  ionViewWillEnter() {
    let token;
    token = localStorage.getItem("userToken");

    if (token == null || token == "") {
      this.navCtrl.setRoot("PagesLoginPage");
    }
  }

  ionViewDidLoad() {
    //contador
    this.refreshData();
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.refreshData();
    }, 1000);

    this.api.data$.takeUntil(this.unsubscribe).subscribe((data) => {
      return data;
    });

    const current = this.api.getUserData();
    this.details = {
      id: current.id,
      first_name: current.first_name,
      last_name: current.last_name,
      email: current.email,
      password: "",
      exp: current.exp,
      iat: current.iat,
      uid: current.uid,
    };
    // this.registros();
  }
  refreshData() {
    this.api.updateData().takeUntil(this.unsubscribe).subscribe();
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout() {
    this.api.logout();
    this.navCtrl.setRoot("PagesLoginPage");
  }
}
