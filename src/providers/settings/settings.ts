import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class SettingsProvider {

  athleticMaps:boolean;
  athleticSubscription:string;
  superMode:boolean;
  extraOptions:Array<string>;
  athleticSubscriptionChanged:boolean = false;

  remoteOverride:any = {"ddd":{}, "scheduleOverride":{}, "letterOverride":{}, "eventsOverride":{CT:{}, CP:{}}};

  constructor(public http: Http, public events: Events) {
    let temp = localStorage.getItem("athleticMaps");
    if(temp == "" || temp == undefined || temp == "true"){
      this.athleticMaps = true;
    }else{
      this.athleticMaps = false;
    }

    temp = localStorage.getItem("athleticSubscription");
    if(temp == "" || temp == undefined){
      this.athleticSubscription = "";
    }else{
      this.athleticSubscription = temp;
    }

    temp = localStorage.getItem("remoteOverride");
    if(temp != "" && temp != undefined){
      this.remoteOverride = JSON.parse(temp);
    }
    this.refreshRemoteOverride();
  }

  refreshRemoteOverride(){
    this.http.get("http://mirror.pingry.k12.nj.us/software/RemoteConfig.json?d="+Date.now()).map(data => data.json()).subscribe(data => {
      this.remoteOverride = data;
      localStorage.setItem("remoteOverride", JSON.stringify(data));
      this.events.publish("remoteOverrideRefresh");
    })
  }

  getAthleticCalendars(){
    return [
      ["Baseball - Boys Junior Varsity", "http://www.pingry.org/calendar/team_119.ics"],
      //["Baseball - Boys Middle School A", "http://www.pingry.org/calendar/team_210.ics"],
      //["Baseball - Boys Middle School B", "http://www.pingry.org/calendar/team_211.ics"],
      //["Baseball - Boys MS", "http://www.pingry.org/calendar/team_223.ics"],
      ["Baseball - Boys Varsity", "http://www.pingry.org/calendar/team_121.ics"],
      ["Basketball - Boys Frosh", "http://www.pingry.org/calendar/team_222.ics"],
      ["Basketball - Boys Junior Varsity", "http://www.pingry.org/calendar/team_123.ics"],
      //["Basketball - Boys Middle School A", "http://www.pingry.org/calendar/team_124.ics"],
      //["Basketball - Boys Middle School B", "http://www.pingry.org/calendar/team_207.ics"],
      //["Basketball - Boys Middle School C", "http://www.pingry.org/calendar/team_230.ics"],
      ["Basketball - Boys Varsity", "http://www.pingry.org/calendar/team_125.ics"],
      ["Basketball - Girls Junior Varsity", "http://www.pingry.org/calendar/team_126.ics"],
      //["Basketball - Girls Middle School A", "http://www.pingry.org/calendar/team_205.ics"],
      //["Basketball - Girls Middle School B", "http://www.pingry.org/calendar/team_206.ics"],
      ["Basketball - Girls Varsity", "http://www.pingry.org/calendar/team_127.ics"],
      ["Cross Country -  Frosh", "http://www.pingry.org/calendar/team_251.ics"],
      ["Cross Country - Boys Junior Varsity", "http://www.pingry.org/calendar/team_249.ics"],
      ["Cross Country - Boys Varsity", "http://www.pingry.org/calendar/team_97.ics"],
      //["Cross Country - Coed MS", "http://www.pingry.org/calendar/team_99.ics"],
      ["Cross Country - Girls Junior Varsity", "http://www.pingry.org/calendar/team_250.ics"],
      ["Cross Country - Girls Varsity", "http://www.pingry.org/calendar/team_100.ics"],
      ["Fencing - Boys Varsity", "http://www.pingry.org/calendar/team_129.ics"],
      //["Fencing - Coed MS", "http://www.pingry.org/calendar/team_130.ics"],
      ["Fencing - Girls Varsity", "http://www.pingry.org/calendar/team_132.ics"],
      ["Field Hockey - Girls Junior Varsity", "http://www.pingry.org/calendar/team_37.ics"],
      //["Field Hockey - Girls MS", "http://www.pingry.org/calendar/team_38.ics"],
      ["Field Hockey - Girls Varsity", "http://www.pingry.org/calendar/team_39.ics"],
      ["Football - Boys Junior Varsity", "http://www.pingry.org/calendar/team_34.ics"],
      //["Football - Boys MS", "http://www.pingry.org/calendar/team_35.ics"],
      ["Football - Boys Varsity", "http://www.pingry.org/calendar/team_36.ics"],
      ["Golf - Boys Junior Varsity", "http://www.pingry.org/calendar/team_212.ics"],
      ["Golf - Boys Varsity", "http://www.pingry.org/calendar/team_135.ics"],
      ["Golf - Girls Junior Varsity", "http://www.pingry.org/calendar/team_213.ics"],
      ["Golf - Girls Varsity", "http://www.pingry.org/calendar/team_138.ics"],
      ["Ice Hockey - Boys Junior Varsity", "http://www.pingry.org/calendar/team_139.ics"],
      ["Ice Hockey - Boys Varsity", "http://www.pingry.org/calendar/team_140.ics"],
      //["Ice Hockey - Coed MS", "http://www.pingry.org/calendar/team_141.ics"],
      ["Ice Hockey - Girls Varsity", "http://www.pingry.org/calendar/team_142.ics"],
      ["Lacrosse - Boys Frosh", "http://www.pingry.org/calendar/team_143.ics"],
      ["Lacrosse - Boys Junior Varsity", "http://www.pingry.org/calendar/team_144.ics"],
      //["Lacrosse - Boys Middle School A", "http://www.pingry.org/calendar/team_214.ics"],
      //["Lacrosse - Boys Middle School B", "http://www.pingry.org/calendar/team_215.ics"],
      //["Lacrosse - Boys MS", "http://www.pingry.org/calendar/team_145.ics"],
      ["Lacrosse - Boys Varsity", "http://www.pingry.org/calendar/team_146.ics"],
      ["Lacrosse - Girls Frosh", "http://www.pingry.org/calendar/team_147.ics"],
      ["Lacrosse - Girls Junior Varsity", "http://www.pingry.org/calendar/team_148.ics"],
      //["Lacrosse - Girls Middle School A", "http://www.pingry.org/calendar/team_216.ics"],
      //["Lacrosse - Girls Middle School B", "http://www.pingry.org/calendar/team_217.ics"],
      //["Lacrosse - Girls MS", "http://www.pingry.org/calendar/team_224.ics"],
      ["Lacrosse - Girls Varsity", "http://www.pingry.org/calendar/team_150.ics"],
      ["Ski Team - Boys Junior Varsity", "http://www.pingry.org/calendar/team_228.ics"],
      ["Ski Team - Boys Varsity", "http://www.pingry.org/calendar/team_201.ics"],
      ["Ski Team - Girls Junior Varsity", "http://www.pingry.org/calendar/team_229.ics"],
      ["Ski Team - Girls Varsity", "http://www.pingry.org/calendar/team_202.ics"],
      ["Soccer - Boys Frosh", "http://www.pingry.org/calendar/team_59.ics"],
      ["Soccer - Boys Junior Varsity", "http://www.pingry.org/calendar/team_6.ics"],
      //["Soccer - Boys Middle School A", "http://www.pingry.org/calendar/team_155.ics"],
      //["Soccer - Boys Middle School B", "http://www.pingry.org/calendar/team_203.ics"],
      //["Soccer - Boys Middle School C", "http://www.pingry.org/calendar/team_234.ics"],
      ["Soccer - Boys Varsity", "http://www.pingry.org/calendar/team_61.ics"],
      ["Soccer - Girls Frosh", "http://www.pingry.org/calendar/team_248.ics"],
      ["Soccer - Girls Junior Varsity", "http://www.pingry.org/calendar/team_63.ics"],
      //["Soccer - Girls MS", "http://www.pingry.org/calendar/team_226.ics"],
      ["Soccer - Girls Varsity", "http://www.pingry.org/calendar/team_5.ics"],
      ["Softball - Girls Junior Varsity", "http://www.pingry.org/calendar/team_151.ics"],
      //["Softball - Girls Middle School A", "http://www.pingry.org/calendar/team_218.ics"],
      //["Softball - Girls Middle School B", "http://www.pingry.org/calendar/team_219.ics"],
      //["Softball - Girls MS", "http://www.pingry.org/calendar/team_225.ics"],
      ["Softball - Girls Varsity", "http://www.pingry.org/calendar/team_153.ics"],
      ["Squash - Boys Varsity", "http://www.pingry.org/calendar/team_158.ics"],
      ["Squash - Coed Junior Varsity", "http://www.pingry.org/calendar/team_194.ics"],
      ["Squash - Coed Varsity", "http://www.pingry.org/calendar/team_161.ics"],
      ["Squash - Girls Varsity", "http://www.pingry.org/calendar/team_162.ics"],
      ["Swimming - Boys Varsity", "http://www.pingry.org/calendar/team_163.ics"],
      //["Swimming - Coed MS", "http://www.pingry.org/calendar/team_165.ics"],
      ["Swimming - Girls Varsity", "http://www.pingry.org/calendar/team_166.ics"],
      ["Tennis - Boys Junior Varsity", "http://www.pingry.org/calendar/team_167.ics"],
      //["Tennis - Boys MS", "http://www.pingry.org/calendar/team_168.ics"],
      ["Tennis - Boys Varsity", "http://www.pingry.org/calendar/team_169.ics"],
      ["JV-2 Girls Tennis", "http://www.pingry.org/calendar/team_235.ics"],
      ["Tennis - Girls Junior Varsity", "http://www.pingry.org/calendar/team_77.ics"],
      //["Tennis - Girls MS", "http://www.pingry.org/calendar/team_78.ics"],
      ["Tennis - Girls Varsity", "http://www.pingry.org/calendar/team_79.ics"],
      ["Track - Boys Varsity", "http://www.pingry.org/calendar/team_171.ics"],
      //["Track - Coed MS", "http://www.pingry.org/calendar/team_173.ics"],
      ["Track - Girls Varsity", "http://www.pingry.org/calendar/team_175.ics"],
      ["Water Polo - Coed Junior Varsity", "http://www.pingry.org/calendar/team_89.ics"],
      //["Water Polo - Coed MS", "http://www.pingry.org/calendar/team_220.ics"],
      ["Water Polo - Coed Varsity", "http://www.pingry.org/calendar/team_221.ics"],
      ["Winter Track - Boys Varsity", "http://www.pingry.org/calendar/team_208.ics"],
      ["Winter Track - Girls Varsity", "http://www.pingry.org/calendar/team_209.ics"],
      ["Wrestling - Boys Junior Varsity", "http://www.pingry.org/calendar/team_179.ics"],
      //["Wrestling - Boys MS", "http://www.pingry.org/calendar/team_180.ics"],
      ["Wrestling - Boys Varsity", "http://www.pingry.org/calendar/team_181.ics"]
    ];
  }

  getAthleticSubscription(){
    return this.athleticSubscription;
  }

  setAthleticSubscription(newVal){
    this.athleticSubscription = newVal;
    this.athleticSubscriptionChanged = true;
    localStorage.setItem("athleticSubscription", this.athleticSubscription);
    localStorage.setItem("athleticEvents", null);
    localStorage.setItem("athleticEventsRefreshTime", "");
  }

  getAthleticSubscriptionChanged(){
    return this.athleticSubscriptionChanged;
  }

  setAthleticSubscriptionChanged(val){
    this.athleticSubscriptionChanged = val;
  }

  //Gets whether or not athletic maps are enabled
  getAthleticMaps(){
    return this.athleticMaps;
  }
  //Sets whether or not athletic maps are enabled
  setAthleticMaps(val){
    this.athleticMaps = val;
    if(val){
      localStorage.setItem("athleticMaps", "true");
    }else{
      localStorage.setItem("athleticMaps", "false");
    }
  }
}
