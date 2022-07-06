import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { User } from '../../../users/user';

@Component({
  selector: 'app-sub-contractors',
  templateUrl: './sub-contractors.component.html',
  styleUrls: ['./sub-contractors.component.scss']
})
export class SubContractorsComponent implements OnInit {

  tenants!: GridSettings<User>
  constructor(private remult: Remult) { }

  get $() { return getFields(this, this.remult) };

  @DataControl<SubContractorsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש קבלן משנה' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.tenants.reloadData()
  }

  async initGrid() {
    this.tenants = new GridSettings<User>(this.remult.repo(User), {
      where: { subContractor: true },
      numOfColumnsInGrid: 10,
      columnSettings: (row) => [
        row.name,
        row.mobile,
        row.email
      ],
      rowButtons: [
        {
          click: async (row) => this.openBuilding(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openRequests(row.id),
          showInLine: true
        }
      ]
    })
  }

  async upsertSubContractor(iid = '') {
    if (!iid) iid = ''
    let sc!: User
    let title = ''
    if (iid.length) {
      sc = await this.remult.repo(User).findId(iid, {useCache : false})
      if (!sc) throw `Inspector-Id '${iid}' NOT EXISTS`
      title = `עדכון קבלן משנה ${sc.name}`
    }
    else {
      sc = this.remult.repo(User).create()
      sc.subContractor = true
      title = 'הוספת קבלן משנה חדש'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await sc.save() },
        fields: () => [
          sc.$.name,
          sc.$.mobile,
          sc.$.email]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }


  async openBuilding(tid = '') {

  }

  async openRequests(tid = '') {

  }

}
