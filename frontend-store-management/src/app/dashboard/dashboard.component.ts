import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstant } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage: any;
	data: any;

	ngAfterViewInit() { }

	//importer les module et services et appeler la methode dashboardData() et ngxService.start()
	constructor(private dashboardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService) {
		this.ngxService.start();
		this.dashboardData();
	}

	dashboardData() {
		this.dashboardService.getDetails().subscribe((Response: any) => {
			this.ngxService.stop();
			this.data = Response;
		}, (error: any) => {
			this.ngxService.stop();
			console.log(error);
			if (error.error?.message) {
				this.responseMessage = error.error?.message;
			}
			else {
				this.responseMessage = GlobalConstant.genericError;
			}
			this.snackbarService.openSnackBar(this.responseMessage, GlobalConstant.error);

		})

	}
}
