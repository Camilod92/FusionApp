import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  exp: number;
  iat: number;
  uid: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenDatos {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

@Injectable()
export class ApiProvider {
  apiUrl = "https://api-fusionalogin.herokuapp.com/users";
  private token: string;
  public registros: Observable<any> = new Observable();

  private dataSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  data$: Observable<any> = this.dataSubject.asObservable();

  constructor(public http: HttpClient) {}

  updateData(): Observable<any> {
    return this.getRegistros().do((data) => {
      this.dataSubject.next(data);
    });
  }
  public getRegistros() {
    return this.http.get(this.apiUrl + "/all");
  }

  private saveToken(token: string): void {
    localStorage.setItem("userToken", token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("userToken");
    }
    return this.token;
  }

  public getUserData(): UserProfile {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public registerUser(user: TokenDatos): Observable<any> {
    return this.http.post(this.apiUrl + "/register", user);
  }

  public login(user: TokenDatos): Observable<any> {
    const base = this.http.post(this.apiUrl + "/login", user);

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }

  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("userToken");
  }
}
