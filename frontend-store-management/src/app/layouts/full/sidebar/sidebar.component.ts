import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import jwt_decode from "jwt-decode";
import { MenuItems } from 'src/app/shared/menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;


  //le tokend du localstorage
  token:any = localStorage.getItem('token');
  tokenPayload:any;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    //importer la classe MENUITEMS qui sera utiliser dans le html
    public menuItems:MenuItems
  ) {

    //décoder le token et avoir les données
    this.tokenPayload = jwt_decode(this.token);
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
