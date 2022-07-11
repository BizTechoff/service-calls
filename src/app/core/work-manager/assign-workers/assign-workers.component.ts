import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';

@Component({
  selector: 'app-assign-workers',
  templateUrl: './assign-workers.component.html',
  styleUrls: ['./assign-workers.component.scss']
})
export class AssignWorkersComponent implements OnInit {

  args: {
    rid: string,
    changed?: boolean
  } = { rid: '', changed: false }
  request!: Request
  constructor(private remult: Remult) {
    if (!this.args) {
      this.args = { rid: '', changed: false }
    }
  }

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
    this.request = await this.remult.repo(Request).findId(this.args.rid, { useCache: false })
  }

}
