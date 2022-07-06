import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { User } from '../../../users/user';

@Component({
  selector: 'app-construction-contractors',
  templateUrl: './construction-contractors.component.html',
  styleUrls: ['./construction-contractors.component.scss']
})
export class ConstructionContractorsComponent implements OnInit {

  tenants!: GridSettings<User>
  constructor(private remult: Remult) { }

  get $() { return getFields(this, this.remult) };

  @DataControl<ConstructionContractorsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש מנהל עבודה' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.tenants.reloadData()
  }

  async initGrid() {
    this.tenants = new GridSettings<User>(this.remult.repo(User), {
      where: { constructionContractor: true },
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

  async upsertConstructionContractor(iid = '') {
    if (!iid) iid = ''
    let t!: User
    let title = ''
    if (iid.length) {
      t = await this.remult.repo(User).findId(iid)
      if (!t) throw `Inspector-Id '${iid}' NOT EXISTS`
      title = `עדכון מנהל עבודה ${t.name}`
    }
    else {
      t = this.remult.repo(User).create()
      t.tenant = true
      title = 'הוספת מנהל עבודה חדש'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await t.save() },
        fields: () => [
          t.$.name,
          t.$.mobile,
          t.$.email]
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
