import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { Request } from '../request';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string
  } = { pid: '', cid: '', bid: '', aid: '' }
  requests!: GridSettings<Request>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<RequestsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש פנייה' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.requests.reloadData()
  }

  async initGrid() {
    this.requests = new GridSettings<Request>(this.remult.repo(Request), {
      gridButtons: [{
        icon: 'refresh',
        textInMenu: () => 'רענן',
        click: async () => await this.refresh()
      }],
      rowButtons: [
        {//border_outer: project
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true,
          textInMenu: 'מנהלי עבודה',
          icon: 'engineering'
        },
        {
          click: async (row) => this.openComplexes(row.id),
          showInLine: true,
          textInMenu: 'מתחמים',
          icon: 'workspaces'
        },
        {
          click: async (row) => this.openBuildings(row.id),
          showInLine: true,
          textInMenu: 'בניינים',
          icon: 'location_city'
        },
        {
          click: async (row) => this.openApartments(row.id),
          showInLine: true,
          textInMenu: 'דירות',
          icon: 'house'
        },
        {
          click: async (row) => this.openTenants(row.id),
          showInLine: true,
          textInMenu: 'דיירים',
          icon: 'groups'
        },
        {
          click: async (row) => this.upserRequest(row.id),
          showInLine: true,
          textInMenu: 'פרטי פרויקט',
          icon: 'edit'
        }
      ]
    })
  }

  async upserRequest(aid = '') {
    if (!aid) aid = ''
    let r!: Request
    let title = ''
    if (aid.length) {
      r = await this.remult.repo(Request).findId(aid, {useCache : false})
      if (!r) throw `Request-Id '${aid}' NOT EXISTS`
      title = `עדכון פנייה ${r.date}`
    }
    else {
      r = this.remult.repo(Request).create()
      title = 'הוספת פנייה חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await r.save() },
        fields: () => [
          r.$.date,
          r.$.time,
          r.$.tenant]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(pid = '') {

  }

  async openBuildings(pid = '') {

  }

  async openComplexes(pid = '') {

  }

  async openApartments(pid = '') {

  }

  async openTenants(pid = '') {

  }

}
