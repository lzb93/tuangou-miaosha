import { getTeamFound } from '../../../services/API';
import { js_date_time } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    founds: '',
    btn: false,
    userIds: [],
    userId: ''
  },
  onLoad(options) {
    if (app.userInfo) {
      this.setData({
        userId: app.userInfo.user_id
      })
    }
    const foundId = options.foundId;
    getTeamFound({ found_id: foundId }).then(({ status, result, msg }) => {
      if (status == 1) {
        const teamFound = result.teamFound;
        let founds = [];
        (result.teamFollow || []).forEach(item => {
          founds.push(item);
        })
        for (let i = 0; i < (teamFound.need - teamFound.join); i++) {
          founds.push([])
        }

        let userIds = [];
        userIds.push(teamFound.user_id);
        (result.teamFollow || []).forEach(item => {
          userIds.push(item.follow_user_id);
        })
        let btnObject = userIds.find(item => {
          return item == (this.data.userId || '');
        })
        this.setData({
          // goods: result.teamFound.teamActivity.goods,
          teamFound: result.teamFound,
          team: result.team,
          founds: founds,
          startTime: js_date_time(teamFound.found_time),
          endTime: js_date_time(teamFound.found_end_time),
          btn: !!btnObject
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  onShareAppMessage(res) {
    return {
      url: app.http,
      share: {
        title: '拼团分享',
      }
    }
  },
  goTeam() {
    const team = this.data.team;
    const teamFound = this.data.teamFound;
    wx.navigateTo({
      url: `/pages/TEAM/detail/detail?id=${team.goods_id}&team_id=${team.team_id}&found_id=${teamFound.found_id}`
    })
  }
})
