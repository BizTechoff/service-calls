import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { Remult } from 'remult';
import { Request } from '../request/request';

@Component({
  selector: 'app-current-state',
  templateUrl: './current-state.component.html',
  styleUrls: ['./current-state.component.scss']
})
export class CurrentStateComponent implements OnInit {

  colors = [
    '#91D7D7',//green
    '#FAC090',//orange
    '#FDE098',//yello
    '#84C5F1',//blue
    '#FD9FB3',//red
    'ffce56',//yellow2
    'cc65fe',//purple
    '36a2eb',//blue2
    'ff6384'//red2
    // 'gray'
  ];

  public pieChartColors: Color[] = [{ backgroundColor: this.colors }];
  public pieChartDataStatuses: SingleDataSet = [];
  public pieChartLabelsStatuses: Label[] = [];
  public pieChartPlugins = [];
  public pieChartLegend = true;
  public pieChartType: ChartType = 'pie';

  public pieChartOptionsByStatuses: ChartOptions = {
    responsive: true,
    // onClick: (event: MouseEvent, legendItem: any) => {
    //   // this.openActivitiesByStatuses()
    //   return false;
    // },//type PositionType = 'left' | 'right' | 'top' | 'bottom' | 'chartArea';
    title: { text: 'פניות פתוחות', display: true },
    // maintainAspectRatio: false,
    // layout: { padding: { left: +28 } },
    legend: {
      // align: 'start',
      // rtl: true,
      // textDirection: 'rtl',
      position: 'right',
      // onClick: (event: MouseEvent, legendItem: any) => {
      //   // this.currentStatFilter = this.pieChartStatObjects[legendItem.index];

      //   return false;
      // }
    },
  };
  constructor(private remult: Remult) { }
  filterBy = filterBy

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
    let statuses: { caption: string, count: number }[] = []
    let requests = await this.remult.repo(Request).find()
    for (const r of requests) {
      let label = r.status?.caption;//.replace('ממתין', 'לא');
      let found = statuses.find(s => s.caption === label)
      if (!found) {
        found = { caption: label, count: 0 }
        statuses.push(found)
      }
      ++found.count
    }
    // if (a.status === ActivityStatus.problem) {
    //   label = label;
    // }
    // label += ` (${6})`;// ` (${r.count})`;
    this.pieChartLabelsStatuses.push(statuses.map(s=>s.caption));//label.replace('הסתיים ב', ''));
    this.pieChartDataStatuses.push(statuses.map(s=>s.count));//r.count);
  }

  public async chartClicked(by: filterBy, e: any) {

  }

}

export class filterBy {
  static branch = new filterBy()
  static status = new filterBy()
  static purpose = new filterBy()
  static period = new filterBy()
  static day = new filterBy()
}
