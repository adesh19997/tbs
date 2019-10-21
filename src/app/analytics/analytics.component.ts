import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  analysisData: any = {}
  Stock = this.config.setAnalyticStockField();
  Order = this.config.setAnalyticOrderField();
  highcharts = Highcharts;
  constructor(
    private config: ConfigService,
    public data: DataService) { 
      this.data.getProducts();
      this.data.getAllStocks();
      this.data.getOrder();
    }

  ngOnInit() {
    this.getAnalysis();
  }
  getAnalysis() {
    this.data.postDataToServer({}, 'basicAnalysis').subscribe(response => {
      if (response instanceof Object) {
        this.Order.forEach(element => {
          this.config.getDataValue(element, element.mapping, response);
        });
        this.Stock.forEach(element => {
          this.config.getDataValue(element, element.mapping, response);
        });
        
      }
    }, error => {
      alert("error fetching analysis" + error);
    })
  }
}
