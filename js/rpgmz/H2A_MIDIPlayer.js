/*:
 * @target MZ
 * @plugindesc MIDIファイルをBGMとして再生します。
 * @author Had2Apps
 * @url https://github.com/katai5plate/RPGMakerPlugins
 *
 * @param fileExtension
 * @text MIDI拡張子
 * @desc 配置するMIDIファイルの拡張子です。パス指定時には入力しません。
 * @type select
 * @option mid
 * @value mid
 * @option midi
 * @value midi
 * @default mid
 *
 * @param generateVolume
 * @text MIDI生成音量
 * @desc PicoAudioのノート生成時の基準音量です。通常のBGM／ME音量設定とは別です。
 * @type number
 * @min 0
 * @decimals 3
 * @default 0.75
 *
 * @param titleBgm
 * @text タイトルBGM
 * @desc データベースのタイトルBGMをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiBgm>
 * @default
 *
 * @param battleBgm
 * @text 戦闘BGM
 * @desc データベースの戦闘BGMをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiBgm>
 * @default
 *
 * @param victoryMe
 * @text 勝利ME
 * @desc データベースの勝利MEをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiMe>
 * @default
 *
 * @param defeatMe
 * @text 敗北ME
 * @desc データベースの敗北MEをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiMe>
 * @default
 *
 * @param gameoverMe
 * @text ゲームオーバーME
 * @desc データベースのゲームオーバーMEをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiMe>
 * @default
 *
 * @param boatBgm
 * @text 小型船BGM
 * @desc データベースの小型船BGMをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiBgm>
 * @default
 *
 * @param shipBgm
 * @text 大型船BGM
 * @desc データベースの大型船BGMをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiBgm>
 * @default
 *
 * @param airshipBgm
 * @text 飛行船BGM
 * @desc データベースの飛行船BGMをMIDIで上書きします。空欄なら上書きしません。
 * @type struct<MidiBgm>
 * @default
 *
 * @command play
 * @text MIDI BGMの再生
 * @desc 指定したMIDIファイルをBGMとして再生します。通常BGMは停止します。
 *   @arg fileName
 *   @text ファイル名
 *   @desc audio/bgm/からの相対パスです。例: midi/op1（拡張子不要）
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *   @arg loop
 *   @text ループ再生
 *   @desc CC:111があれば、そこから局所ループします。
 *   @type boolean
 *   @default true
 *
 * @command stop
 * @text MIDI BGMの停止
 * @desc 再生中のMIDI BGMを停止します。
 *
 * @command playMe
 * @text MIDI MEの再生
 * @desc 指定したMIDIファイルをMEとして再生します。BGMはME終了後に再開します。
 *   @arg fileName
 *   @text ファイルパス
 *   @desc audio/me/からの相対パスです。例: midi/victory1（拡張子不要）
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *
 * @command setBattleBgm
 * @text 戦闘MIDI BGMの変更
 * @desc 以後の戦闘BGMを指定MIDIへ変更します。
 *   @arg fileName
 *   @text ファイル名
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *
 * @command setVehicleBgm
 * @text 乗り物MIDI BGMの変更
 * @desc 指定した乗り物のBGMをMIDIへ変更します。
 *   @arg vehicle
 *   @text 乗り物
 *   @type select
 *   @option 小型船
 *   @value boat
 *   @option 大型船
 *   @value ship
 *   @option 飛行船
 *   @value airship
 *   @default boat
 *   @arg fileName
 *   @text ファイル名
 *   @type string
 *   @arg volume
 *   @text 音量
 *   @type number
 *   @min 0
 *   @max 100
 *   @default 90
 *
 * @help
 * BGM用のMIDIファイルは audio/bgm/ 以下、ME用のMIDIファイルは audio/me/ 以下に
 * 配置してください。BGM欄・BGMコマンドにはaudio/bgm/からの相対パス、
 * ME欄・MEコマンドにはaudio/me/からの相対パスを指定します。
 * 例: audio/bgm/midi/op1.mid は midi/op1、audio/me/midi/victory1.mid は midi/victory1
 * MIDI拡張子はプラグイン設定で mid または midi を選択します。
 * MZのファイル選択UIはMIDIを選択できないため、パスは直接入力します。
 *
 * 通常BGMの開始時はMIDI BGMを停止し、MIDI BGMの開始時は通常BGMを停止します。
 * イベントコマンドの「BGMのフェードアウト」「BGMの保存」「BGMの再開」に対応します。
 * CC:111を含むMIDIは、CC:111の位置から局所ループします。
 * MIDI生成音量はPicoAudioの合成音量です。通常のBGM／ME音量とは別に調整します。
 * 和音の多いMIDIで値を上げすぎると、音割れが起こることがあります。
 *
 */

/*~struct~MidiBgm:
 * @param fileName
 * @text ファイル名
 * @desc audio/bgm/からの相対パスです。例: midi/op1（拡張子不要）
 * @type string
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */

/*~struct~MidiMe:
 * @param fileName
 * @text ファイル名
 * @desc audio/me/からの相対パスです。例: midi/victory1（拡張子不要）
 * @type string
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */
/*!
 * MIT License
 * 
 * Copyright (c) 2017-2021 cagpie / Shun Kobayashi (cagpie@gmail.com)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
globalThis.__Vendor_PicoAudio=(()=>{function ie(s){this.debug=!1,this.isStarted=!1,this.isPlayed=!1,this.settings={masterVolume:1,generateVolume:.15,tempo:120,basePitch:440,resolution:480,isWebMIDI:!1,WebMIDIPortOutputs:null,WebMIDIPortOutput:null,WebMIDIPort:-1,WebMIDIPortSysEx:!0,isReverb:!0,reverbVolume:1.5,initReverb:10,isChorus:!0,chorusVolume:.5,isCC111:!0,loop:!1,isSkipBeginning:!1,isSkipEnding:!0,holdOnValue:64,maxPoly:-1,maxPercPoly:-1,isOfflineRendering:!1,isSameDrumSoundOverlap:!1,baseLatency:-1},Y(this,s,"debug");for(let t in this.settings)Y(this.settings,s,t);this.events=[],this.trigger={isNoteTrigger:!0,play:()=>{},stop:()=>{},noteOn:()=>{},noteOff:()=>{},songEnd:()=>{}},this.states={isPlaying:!1,startTime:0,stopTime:0,stopFuncs:[],webMIDIWaitState:null,webMIDIStopTime:0,playIndices:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],updateBufTime:100,updateBufMaxTime:350,updateIntervalTime:0,latencyLimitTime:0},this.hashedDataList=[],this.hashedMessageList=[],this.playData=null,this.channels=[],this.tempoTrack=[{timing:0,value:120},{timing:0,value:120}],this.cc111Time=-1,this.onSongEndListener=null,this.baseLatency=.01;for(let t=0;t<17;t++)this.channels.push([0,0,1]);s&&s.audioContext&&this.init(s)}function Y(s,t,a){t&&t[a]!=null&&s&&s[a]!=null&&(s[a]=t[a])}class H{static resetSeed(){this.init=!0,this.x=123456789,this.y=362436069,this.z=521288629,this.w=8867512}static random(){this.init||this.resetSeed();const t=this.x^this.x<<11;this.x=this.y,this.y=this.z,this.z=this.w;let a=this.w=this.w^this.w>>>19^(t^t>>>8);return a=Math.abs(a)/2147483648%2,a}}class J{static lerpWave(t,a){const i=t.getChannelData(0).length,c=a[0].length;if(i==c)for(let e=0;e<2;e++){const n=t.getChannelData(e),u=a[e];for(let r=0;r<i;r++)n[r]=u[r]}else{const e=c/i;for(let n=0;n<2;n++){const u=t.getChannelData(n),r=a[n];for(let l=0;l<i;l++){const b=l*e,V=Math.trunc(b),h=(V+1)%c,m=b-V,o=r[V]*(1-m)+r[h]*m;u[l]=o}}}}}function se(s){if(this.isStarted)return;this.isStarted=!0;const t=s&&s.audioContext,a=s&&s.picoAudio,i=window.AudioContext||window.webkitAudioContext;this.context=t||new i,this.masterGainNode=this.context.createGain(),this.masterGainNode.gain.value=this.settings.masterVolume;const c=this.context.sampleRate,e=c>=48e3?48e3:c;if(a&&a.whitenoise)this.whitenoise=a.whitenoise;else{H.resetSeed();const n=1,u=c*n,r=e*n,l=[];for(let b=0;b<2;b++){l.push(new Float32Array(r));const V=l[b];for(let h=0;h<r;h++){const m=H.random();V[h]=m*2-1}}this.whitenoise=this.context.createBuffer(2,u,c),J.lerpWave(this.whitenoise,l)}if(a&&a.impulseResponse)this.impulseResponse=a.impulseResponse;else{H.resetSeed();const n=3.5,u=c*n,r=e*n,l=[];for(let b=0;b<2;b++){l.push(new Float32Array(r));const V=l[b];for(let h=0;h<r;h++){const m=(r-h)/r,o=h/e,g=(o<.03?0:m)*(o>=.03&&o<.031?m*2:m)*(o>=.04&&o<.042?m*1.5:m)*(o>=.05&&o<.054?m*1.25:m)*H.random()*.2*Math.pow(m-.03,4);V[h]=g}}this.impulseResponse=this.context.createBuffer(2,u,this.context.sampleRate),J.lerpWave(this.impulseResponse,l)}this.convolver=this.context.createConvolver(),this.convolver.buffer=this.impulseResponse,this.convolver.normalize=!0,this.convolverGainNode=this.context.createGain(),this.convolverGainNode.gain.value=this.settings.reverbVolume,this.convolver.connect(this.convolverGainNode),this.convolverGainNode.connect(this.masterGainNode),this.masterGainNode.connect(this.context.destination),this.chorusDelayNode=this.context.createDelay(),this.chorusGainNode=this.context.createGain(),this.chorusOscillator=this.context.createOscillator(),this.chorusLfoGainNode=this.context.createGain(),this.chorusDelayNode.delayTime.value=.025,this.chorusLfoGainNode.gain.value=.01,this.chorusOscillator.frequency.value=.05,this.chorusGainNode.gain.value=this.settings.chorusVolume,this.chorusOscillator.connect(this.chorusLfoGainNode),this.chorusLfoGainNode.connect(this.chorusDelayNode.delayTime),this.chorusDelayNode.connect(this.chorusGainNode),this.chorusGainNode.connect(this.masterGainNode),this.masterGainNode.connect(this.context.destination),this.chorusOscillator.start(0),this.baseLatency=this.context.baseLatency||this.baseLatency,this.settings.baseLatency!=-1&&(this.baseLatency=this.settings.baseLatency)}class W{static now(){return this._now==null&&(typeof window.performance=="undefined"?this._now=()=>window.Date.now():this._now=()=>window.performance.now()),this._now()}}const U=9007199254740991;function ne(s){if(this.debug)var t=W.now();if(this.states.isPlaying&&this.stop(),this.playData=s,this.settings.resolution=s.header.resolution,this.settings.tempo=s.tempo||120,this.tempoTrack=s.tempoTrack,this.cc111Time=s.cc111Time,this.firstNoteOnTiming=s.firstNoteOnTiming,this.lastNoteOffTiming=s.lastNoteOffTiming,this.firstNoteOnTime=s.firstNoteOnTime,this.lastNoteOffTime=s.lastNoteOffTime,this.lastEventTiming=s.lastEventTiming,this.lastEventTime=s.lastEventTime,this.initStatus(),this.debug){const a=W.now();console.log("setData time",a-t)}return this}function ce(s,t){if(!(this.settings.isWebMIDI&&this.states.webMIDIWaitState!=null)&&(this.stop(s),this.states={isPlaying:!1,startTime:0,stopTime:0,stopFuncs:[],webMIDIWaitState:null,webMIDIStopTime:this.states.webMIDIStopTime,playIndices:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],updateBufTime:this.states.updateBufTime,updateBufMaxTime:this.states.updateBufMaxTime,updateIntervalTime:this.states.updateIntervalTime,latencyLimitTime:this.states.latencyLimitTime,noteOnAry:[],noteOffAry:[]},this.settings.isWebMIDI&&!t)){if(s)return;if(this.settings.WebMIDIPortOutput==null){this.startWebMIDI();return}if(this.settings.WebMIDIPortSysEx)this.settings.WebMIDIPortOutput.send([240,126,127,9,1,247]);else for(let a=0;a<16;a++)this.settings.WebMIDIPortOutput.send([192+a,0]),this.settings.WebMIDIPortOutput.send([224+a,0,64]),this.settings.WebMIDIPortOutput.send([176+a,100,0]),this.settings.WebMIDIPortOutput.send([176+a,101,0]),this.settings.WebMIDIPortOutput.send([176+a,6,2]),this.settings.WebMIDIPortOutput.send([176+a,100,1]),this.settings.WebMIDIPortOutput.send([176+a,96,0]),this.settings.WebMIDIPortOutput.send([176+a,97,64]),this.settings.WebMIDIPortOutput.send([176+a,7,100]),this.settings.WebMIDIPortOutput.send([176+a,10,64]),this.settings.WebMIDIPortOutput.send([176+a,11,127]),this.settings.WebMIDIPortOutput.send([176+a,98,0]),this.settings.WebMIDIPortOutput.send([176+a,99,0]),this.settings.WebMIDIPortOutput.send([176+a,122,0])}}class q extends Array{static delete(t,a){a==t.length-1?t.pop():a==0?t.shift():t.splice(a,1)}}class L{static getInt(t,a,i){let c=0;for(let e=a;e<i;e++)c=(c<<8)+t[e];return c}static variableLengthToInt(t,a,i){let c=a,e=0;for(;c<i-1&&t[c]>=128;)c<a+4&&(e=(e<<7)+(t[c]-128)),c++;return e=(e<<7)+t[c],c++,[e,c-a]}static chIndicesInsert(t,a,i,c,e){const n=a.indices;if(a.indicesLength>=4&&i<n[a.indicesFoot])for(;a.indicesCur!=-1;){if(i<n[a.indicesCur]){a.indicesCur==a.indicesHead?a.indicesHead=a.indicesLength:n[a.indicesPre+3]=a.indicesLength,n[a.indicesLength]=i,n[a.indicesLength+1]=e,n[a.indicesLength+2]=c,n[a.indicesLength+3]=a.indicesCur,a.indicesPre=a.indicesLength,a.indicesLength+=4;break}a.indicesPre=a.indicesCur,a.indicesCur=n[a.indicesCur+3]}else a.indicesLength>=4?n[a.indicesFoot+3]=a.indicesLength:a.indicesHead=0,a.indicesFoot=a.indicesLength,n[a.indicesLength]=i,n[a.indicesLength+1]=e,n[a.indicesLength+2]=c,n[a.indicesLength+3]=-1,a.indicesLength+=4}}class K{static init(t,a){this.updatePreTime=W.now(),this.pPreTime=W.now(),this.cPreTime=t.context.currentTime*1e3,this.pTimeSum=0,this.cTimeSum=0,this.cnt=0,this.initCurrentTime=a}static update(t){const a=t.context,i=t.settings,c=t.states,e=t.baseLatency,n=W.now(),u=this.updatePreTime;let r=this.pPreTime,l=this.cPreTime,b=this.pTimeSum,V=this.cTimeSum,h=this.cnt,m=n-u;const o=n,g=a.currentTime*1e3;b+=o-r,V+=g-l,r=o,l=g;const M=b-V;if(c.latencyTime=M,M>=100?(c.latencyLimitTime+=M,V+=100):M<=-100?V=b:c.latencyLimitTime>0&&(c.latencyLimitTime-=m*.003,c.latencyLimitTime<0&&(c.latencyLimitTime=0)),c.updateIntervalTime=m,c.updateBufTime<m?c.updateBufTime=m:(c.updateBufMaxTime>350&&(c.updateBufMaxTime-=c.updateBufMaxTime*.002),c.updateBufTime<20&&(c.updateBufTime+=c.updateBufTime*5e-4),c.updateBufMaxTime>=10&&c.updateBufMaxTime<340&&(c.updateBufMaxTime+=c.updateBufMaxTime*.002)),c.updateBufTime>c.updateBufMaxTime){if(m>=900&&c.latencyLimitTime<=150)c.updateBufMaxTime+=m;else{const x=m-c.updateBufMaxTime;c.updateBufTime=c.updateBufMaxTime,c.updateBufMaxTime<10?(c.updateBufTime=c.updateBufMaxTime,c.updateBufMaxTime*=1.25):c.updateBufMaxTime+=x/2}c.updateBufMaxTime>1100&&(c.updateBufMaxTime=1100)}c.latencyLimitTime>150&&(V=b,c.latencyLimitTime-=5,c.latencyLimitTime>1e3&&(c.latencyLimitTime=1e3),c.updateBufMaxTime=1,c.updateBufTime=1,m=1);for(let x=0;x<16;x++){const T=t.playData.channels[x].notes;let p=c.playIndices[x];for(;p<T.length;p++){const d=T[p],O=h==0?this.initCurrentTime-c.startTime:a.currentTime-c.startTime;if(!(O>=d.stopTime)&&!(h==0&&O>d.startTime+e)){if(O<d.startTime-c.updateBufTime/1e3)break;if(!i.isWebMIDI){if(c.stopFuncs.length>=350&&c.updateBufTime<1e3&&(c.updateBufTime=12,c.updateBufMaxTime=c.updateBufTime),i.maxPoly!=-1||i.maxPercPoly!=-1){let k=0,y=0;if(c.stopFuncs.forEach(f=>{f.note&&(f.note.channel!=9?d.start>=f.note.start&&d.start<f.note.stop&&k++:d.start==f.note.start&&y++)}),d.channel!=9&&k>=i.maxPoly||d.channel==9&&y>=i.maxPercPoly)continue}const I=d.channel!=9?t.createNote(d):t.createPercussionNote(d);if(!I)continue;t.pushFunc({note:d,stopFunc:I})}c.noteOnAry.push(d)}}c.playIndices[x]=p}if(this.checkNoteOn(t),this.checkNoteOff(t),i.isWebMIDI&&i.WebMIDIPortOutput!=null){const x=t.playData.messages,T=t.playData.smfData;let p=c.playIndices[16];for(;p<x.length;p++){const d=x[p],O=a.currentTime-c.startTime;if(O>d.time+1)continue;if(O<d.time-1)break;const I=d.smfPtrLen,k=d.smfPtr,y=d.time,f=T[k];if(f!=255)try{if(f==240||f==247){if(i.WebMIDIPortSysEx){const A=L.variableLengthToInt(T,k+1,k+1+4),N=k+1+A[1],w=N+A[0],B=new Uint8Array(1+A[0]);B[0]=f;const C=w-N;for(let G=0;G<C;G++)B[G+1]=T[N+G];i.WebMIDIPortOutput.send(B,(y-a.currentTime+W.now()/1e3+c.startTime)*1e3)}}else{const A=[];for(let N=0;N<I;N++)A.push(T[k+N]);i.WebMIDIPortOutput.send(A,(y-a.currentTime+W.now()/1e3+c.startTime)*1e3)}}catch(A){console.log(A,k,I,y,f)}}c.playIndices[16]=p}h++,this.updatePreTime=n,this.pPreTime=r,this.cPreTime=l,this.pTimeSum=b,this.cTimeSum=V,this.cnt=h}static checkNoteOn(t){const a=t.context,i=t.trigger,c=t.states,e=t.states.noteOnAry,n=t.states.noteOffAry;for(let u=0;u<e.length;u++){const r=e[u],l=a.currentTime-c.startTime;r.startTime-l<=0&&(q.delete(e,u),n.push(r),i.isNoteTrigger&&i.noteOn(r),t.fireEvent("noteOn",r),u--)}}static checkNoteOff(t){const a=t.context,i=t.trigger,c=t.states,e=t.states.noteOffAry;for(let n=0;n<e.length;n++){const u=e[n],r=a.currentTime-c.startTime;(u.channel!=9&&u.stopTime-r<=0||u.channel==9&&u.drumStopTime-r<=0)&&(q.delete(e,n),t.clearFunc("note",u),i.isNoteTrigger&&i.noteOff(u),t.fireEvent("noteOff",u),n--)}}}function re(s){const t=this.context,a=this.settings,i=this.trigger,c=this.states;if(t.resume&&t.resume(),c.isPlaying)return;if(a.isWebMIDI&&!s)if(c.webMIDIWaitState!="completed"){if(c.webMIDIWaitState!="waiting"){c.webMIDIWaitState="waiting";let V=1e3-(t.currentTime-c.webMIDIStopTime)*1e3;c.webMIDIStopTime==0&&(V=1e3),setTimeout(()=>{c.webMIDIWaitState="completed",c.isPlaying=!1,this.play()},V)}return}else c.webMIDIWaitState=null;const e=t.currentTime;if(this.isPlayed=!0,c.isPlaying=!0,c.startTime=!c.startTime&&!c.stopTime?e:c.startTime+e-c.stopTime,c.stopFuncs=[],a.isSkipBeginning){const V=this.firstNoteOnTime;-c.startTime+e<V&&this.setStartTime(V+c.startTime-e)}let n;const u=()=>{this.clearFunc("rootTimeout",n),this.getTime(U)-t.currentTime+c.startTime<=0?(i.songEnd(),this.onSongEnd(),this.fireEvent("songEnd")):(n=setTimeout(u,1),this.pushFunc({rootTimeout:n,stopFunc:()=>{clearTimeout(n)}}))},l=(this.getTime(U)-t.currentTime+c.startTime)*1e3;n=setTimeout(u,l),this.pushFunc({rootTimeout:n,stopFunc:()=>{clearTimeout(n)}}),i.play(),this.fireEvent("play"),K.init(this,e);const b=setInterval(()=>{K.update(this)},1);this.pushFunc({rootTimeout:b,stopFunc:()=>{clearInterval(b)}})}function Q(s){const t=this.states;if(t.isPlaying!=!1){if(t.isPlaying=!1,t.stopTime=this.context.currentTime,t.stopFuncs.forEach(a=>{a.stopFunc()}),t.stopFuncs=[],t.playIndices.forEach((a,i,c)=>{c[i]=0}),t.noteOnAry=[],t.noteOffAry=[],this.settings.isWebMIDI){if(s||this.settings.WebMIDIPortOutput==null)return;t.webMIDIStopTime=this.context.currentTime,setTimeout(()=>{for(let a=0;a<16;a++)this.settings.WebMIDIPortOutput.send([176+a,120,0])},1e3)}this.trigger.stop(),this.fireEvent("pause"),this.fireEvent("stop")}}function le(s,t,a,i,c){const e=this.settings,n=this.context,u=this.states.startTime,r=this.baseLatency,l=i?0:s.channel||0,b=s.velocity*Number(i?1:this.channels[l][2]!=null?this.channels[l][2]:1)*e.generateVolume;let V=!0;if(b<=0)return{isGainValueZero:!0};const h=b*((s.expression?s.expression[0].value:100)/127),m=n.createGain();if(m.gain.value=h,a?s.expression&&s.expression.forEach(y=>{const f=b*(y.value/127);f>0&&(V=!1);const A=Math.max(0,y.time+u+r);m.gain.setValueAtTime(f,A)}):h>0&&(V=!1),V)return{isGainValueZero:!0};const o=s.startTime+u+r,g=s.stopTime+u+r,M=e.basePitch*Math.pow(Math.pow(2,1/12),(s.pitch||69)-69),x=t?n.createBufferSource():n.createOscillator(),T=n.createStereoPanner?n.createStereoPanner():n.createPanner?n.createPanner():{pan:{setValueAtTime:()=>{}}},p=n.createGain(),d=n.createGain();t?(x.loop=!0,x.buffer=this.whitenoise):(x.type=s.type||"sine",x.detune.value=0,x.frequency.value=M,s.pitchBend&&s.pitchBend.forEach(y=>{const f=Math.max(0,y.time+u+r);x.frequency.setValueAtTime(e.basePitch*Math.pow(Math.pow(2,1/12),s.pitch-69+y.value),f)}));const O=s.pan&&s.pan[0].value!=64?s.pan[0].value/127*2-1:0;if(oe(n,T,O),n.createStereoPanner||n.createPanner){let y=!0;if(n.createStereoPanner)s.pan&&s.pan.forEach(f=>{if(y){y=!1;return}const A=Math.min(1,f.value==64?0:f.value/127*2-1),N=Math.max(0,f.time+u+r);T.pan.setValueAtTime(A,N)});else if(n.createPanner)if(T.positionX){let f=!0;s.pan&&s.pan.forEach(A=>{if(f){f=!1;return}const N=A.value==64?0:A.value/127*2-1,w=X(N),B=Math.max(0,A.time+u+r);T.positionX.setValueAtTime(w.x,B),T.positionY.setValueAtTime(w.y,B),T.positionZ.setValueAtTime(w.z,B)})}else s.pan&&s.pan.forEach(f=>{if(y){y=!1;return}const A=setTimeout(()=>{this.clearFunc("pan",A);const N=Math.min(1,f.value==64?0:f.value/127*2-1),w=X(N);T.setPosition(w.x,w.y,w.z)},(f.time+u+r-n.currentTime)*1e3);this.pushFunc({pan:A,stopFunc:()=>{clearTimeout(A)}})});x.connect(T),T.connect(m)}else x.connect(m);m.connect(p),p.connect(d),d.connect(this.masterGainNode),this.masterGainNode.connect(n.destination);let I,k;if(!t&&s.modulation&&(s.modulation.length>=2||s.modulation[0].value>0)){I=n.createOscillator(),k=n.createGain();let y=!0;s.modulation&&s.modulation.forEach(A=>{if(y){y=!1;return}const N=Math.min(1,A.value/127),w=Math.max(0,A.time+u+r);k.gain.setValueAtTime(M*10/440*N,w)});const f=Math.min(1,s.modulation?s.modulation[0].value/127:0);k.gain.value=M*10/440*f,I.frequency.value=6,I.connect(k),k.connect(x.frequency)}if(this.settings.isReverb&&s.reverb&&(s.reverb.length>=2||s.reverb[0].value>0)){const y=this.convolver,f=n.createGain();let A=!0;s.reverb&&s.reverb.forEach(w=>{if(A){A=!1;return}const B=Math.min(1,w.value/127),C=Math.max(0,w.time+u+r);f.gain.setValueAtTime(B,C)});const N=Math.min(1,s.reverb?s.reverb[0].value/127:0);f.gain.value=N,p.connect(d),d.connect(f),f.connect(y)}if(this.settings.isChorus&&s.chorus&&(s.chorus.length>=2||s.chorus[0].value>0)){const y=this.chorusDelayNode,f=n.createGain();let A=!0;s.chorus&&s.chorus.forEach(w=>{if(A){A=!1;return}const B=Math.min(1,w.value/127),C=Math.max(0,w.time+u+r);f.gain.setValueAtTime(B,C)});let N=Math.min(1,s.chorus?s.chorus[0].value/127:0);f.gain.value=N,p.connect(d),d.connect(f),f.connect(y)}return I&&(I.start(o),this.stopAudioNode(I,g,k)),x.start(o),!t&&!i&&!c&&this.stopAudioNode(x,g,d),{start:o,stop:g,pitch:M,channel:l,velocity:b,oscillator:x,panNode:T,gainNode:p,stopGainNode:d,isGainValueZero:!1}}function oe(s,t,a){if(s.createStereoPanner)a>1&&(a=1),t.pan.value=a;else if(s.createPanner){const i=X(a);t.panningModel="equalpower",t.setPosition(i.x,i.y,i.z)}}function X(s){s>1&&(s=1);const t={},a=s*90;return t.x=Math.sin(a*(Math.PI/180)),t.y=0,t.z=-Math.cos(a*(Math.PI/180)),t}function ue(s){const t=this.createBaseNote(s,!1,!0,!1,!0);if(t.isGainValueZero)return null;const a=t.oscillator,i=t.gainNode,c=t.stopGainNode;let e=!1,n=!1,u;switch(this.channels[t.channel][0]*1e3||s.instrument){case 1e3:case 6:case 15:case 24:case 26:case 46:case 50:case 51:case 52:case 53:case 54:case 82:case 85:case 86:{a.type="sine",i.gain.value*=1.5;break}case 2e3:case 4:case 12:case 13:case 16:case 19:case 20:case 32:case 34:case 45:case 48:case 49:case 55:case 56:case 57:case 61:case 62:case 63:case 71:case 72:case 73:case 74:case 75:case 76:case 77:case 78:case 79:case 80:case 84:{a.type="square",i.gain.value*=.8;break}case 3e3:case 0:case 1:case 2:case 3:case 7:case 17:case 18:case 21:case 22:case 23:case 27:case 28:case 29:case 30:case 36:case 37:case 38:case 39:case 40:case 41:case 42:case 43:case 44:case 47:case 59:case 64:case 65:case 66:case 67:case 68:case 69:case 70:case 87:{a.type="sawtooth";break}case 4e3:case 8:case 9:case 10:case 11:case 14:case 25:case 31:case 33:case 35:case 58:case 60:case 83:case 88:case 89:case 90:case 91:case 92:case 93:case 94:case 95:{a.type="triangle",i.gain.value*=1.5;break}default:a.type="square"}switch((a.type=="sine"||a.type=="triangle")&&!e&&t.stop-t.start>.01&&(n=!0),this.channels[t.channel][1]/10||s.instrument){case .2:case 12:case 13:case 45:case 55:{e=!0,i.gain.value*=1.1,i.gain.setValueAtTime(i.gain.value,t.start),i.gain.linearRampToValueAtTime(0,t.start+.2),this.stopAudioNode(a,t.start+.2,c);break}case .3:case 0:case 1:case 2:case 3:case 6:case 9:case 11:case 14:case 15:case 32:case 36:case 37:case 46:case 47:{i.gain.value*=1.1;const r=(128-s.pitch)/128;i.gain.setValueAtTime(i.gain.value,t.start),i.gain.linearRampToValueAtTime(i.gain.value*.85,t.start+r*r/8),i.gain.linearRampToValueAtTime(i.gain.value*.8,t.start+r*r/4),i.gain.setTargetAtTime(0,t.start+r*r/4,5*r*r),this.stopAudioNode(a,t.stop,c,n);break}case .4:case 24:case 25:case 26:case 27:case 28:case 29:case 30:case 31:case 34:{i.gain.value*=1.1,i.gain.setValueAtTime(i.gain.value,t.start),i.gain.linearRampToValueAtTime(0,t.start+1+t.velocity*4),this.stopAudioNode(a,t.stop,c,n);break}case .5:case 4:case 5:case 7:case 8:case 10:case 33:case 35:{i.gain.value*=1,i.gain.setValueAtTime(i.gain.value,t.start),i.gain.linearRampToValueAtTime(i.gain.value*.95,t.start+.1),i.gain.setValueAtTime(i.gain.value*.95,t.start+.1),i.gain.linearRampToValueAtTime(0,t.start+2+t.velocity*10),this.stopAudioNode(a,t.stop,c,n);break}case 119:{if(i.gain.value=0,this.stopAudioNode(a,t.stop,c,n),u=this.createBaseNote(s,!0,!0),u.isGainValueZero)break;u.oscillator.playbackRate.setValueAtTime((s.pitch+1)/128,t.start),u.gainNode.gain.setValueAtTime(0,t.start),u.gainNode.gain.linearRampToValueAtTime(1.3,t.start+2),this.stopAudioNode(u.oscillator,t.stop,u.stopGainNode);break}default:i.gain.value*=1.1,i.gain.setValueAtTime(i.gain.value,t.start),this.stopAudioNode(a,t.stop,c,n)}return()=>{this.stopAudioNode(a,0,c,!0),u&&u.oscillator&&this.stopAudioNode(u.oscillator,0,u.stopGainNode,!0)}}function me(s){const t=this.createBaseNote(s,!0,!1);if(t.isGainValueZero)return null;const a=t.oscillator,i=t.gainNode,c=t.stopGainNode;let e=t.start;const n=1,u=this.createBaseNote(s,!1,!1,!0),r=u.oscillator,l=u.gainNode,b=u.stopGainNode,V=s.nextSameNoteOnInterval;e<this.context.currentTime&&(e=this.context.currentTime);let h=0,m=0;switch(s.pitch){case 35:case 36:i.gain.value=n*.6,a.playbackRate.value=.02,h=.07,l.gain.value=n*1.1,r.frequency.setValueAtTime(120,e),r.frequency.linearRampToValueAtTime(50,e+.07),m=.07;break;case 38:case 40:a.playbackRate.value=.7,h=.05,l.gain.setValueAtTime(n*.8,e),l.gain.linearRampToValueAtTime(0,e+.05),r.frequency.setValueAtTime(300,e),r.frequency.linearRampToValueAtTime(200,e+.05),m=.05;break;case 41:case 43:case 45:case 47:case 48:case 50:a.playbackRate.value=.01,h=.1,r.type="square",l.gain.setValueAtTime(n,e),l.gain.linearRampToValueAtTime(.01,e+.1),r.frequency.setValueAtTime(150+20*(s.pitch-40),e),r.frequency.linearRampToValueAtTime(50+20*(s.pitch-40),e+.1),m=.1;break;case 42:case 44:a.playbackRate.value=1.5,h=.02,m=0;break;case 46:a.playbackRate.value=1.5,h=.3,i.gain.setValueAtTime(n*.9,e),i.gain.linearRampToValueAtTime(0,e+.3),m=0;break;case 49:case 52:case 53:case 55:case 57:a.playbackRate.value=1.2,h=.5,i.gain.setValueAtTime(n*1,e),i.gain.linearRampToValueAtTime(0,e+.5),m=0;break;case 51:a.playbackRate.value=1.1,h=.4,i.gain.setValueAtTime(n*.8,e),i.gain.linearRampToValueAtTime(0,e+.4),m=0;break;case 59:a.playbackRate.value=1.8,h=.3,i.gain.setValueAtTime(n*.5,e),i.gain.linearRampToValueAtTime(0,e+.3),m=0;break;case 60:case 61:a.playbackRate.value=.03,h=.03,l.gain.setValueAtTime(n*.8,e),l.gain.linearRampToValueAtTime(0,e+.1),r.frequency.setValueAtTime(400-40*(s.pitch-60),e),r.frequency.linearRampToValueAtTime(450-40*(s.pitch-60),e+.1),m=.1;break;case 62:a.playbackRate.value=.03,h=.03,l.gain.setValueAtTime(n,e),l.gain.linearRampToValueAtTime(0,e+.03),r.frequency.setValueAtTime(200,e),r.frequency.linearRampToValueAtTime(250,e+.03),m=.03;break;case 63:case 64:a.playbackRate.value=.03,h=.03,l.gain.setValueAtTime(n,e),l.gain.linearRampToValueAtTime(0,e+.1),r.frequency.setValueAtTime(200-30*(s.pitch-63),e),r.frequency.linearRampToValueAtTime(250-30*(s.pitch-63),e+.1),m=.1;break;case 56:case 75:a.playbackRate.value=.01,h=.1,l.gain.setValueAtTime(n,e),l.gain.linearRampToValueAtTime(0,e+.1),r.frequency.setValueAtTime(1e3+48*(s.pitch-56),e),m=.1;break;case 80:a.playbackRate.value=5,i.gain.setValueAtTime(n*.5,e),i.gain.linearRampToValueAtTime(0,e+.2),h=.05,r.type="triangle",l.gain.setValueAtTime(n*.7,e),l.gain.linearRampToValueAtTime(0,e+.2),r.frequency.setValueAtTime(6e3,e),m=.05;break;case 81:a.playbackRate.value=5,i.gain.setValueAtTime(n*.9,e),i.gain.linearRampToValueAtTime(0,e+.5),h=.5,r.type="triangle",l.gain.setValueAtTime(n*.8,e),l.gain.linearRampToValueAtTime(0,e+.3),r.frequency.setValueAtTime(6e3,e),m=.3;break;case 37:{a.playbackRate.value=.26,i.gain.setValueAtTime(n*1.5,e),i.gain.linearRampToValueAtTime(0,e+.041),h=.041,r.frequency.setValueAtTime(330,e),r.frequency.linearRampToValueAtTime(120,e+.02),l.gain.setValueAtTime(n,e),l.gain.linearRampToValueAtTime(0,e+.02),m=.02;break}case 39:{a.playbackRate.value=.5,i.gain.setValueAtTime(n*1.3,e),i.gain.linearRampToValueAtTime(0,e+.01),i.gain.setValueAtTime(n*1.3,e+.0101),i.gain.linearRampToValueAtTime(0,e+.02),i.gain.setValueAtTime(n*1.3,e+.0201),i.gain.linearRampToValueAtTime(0,e+.09),h=.09,r.type="triangle",r.frequency.setValueAtTime(180,e),l.gain.setValueAtTime(n*.8,e),l.gain.linearRampToValueAtTime(0,e+.01),l.gain.setValueAtTime(n*.8,e+.0101),l.gain.linearRampToValueAtTime(0,e+.02),l.gain.setValueAtTime(n*.8,e+.0201),l.gain.linearRampToValueAtTime(0,e+.03),m=.11;break}case 54:{a.playbackRate.setValueAtTime(1,e);let o=s.pitch==54?1:.4;const g=s.pitch==54?.01:0;i.gain.setValueAtTime(n*o/2,e),i.gain.linearRampToValueAtTime(n*o,e+g),i.gain.setTargetAtTime(0,e+g,.05),h=.3,r.frequency.setValueAtTime(s.pitch==54?6e3:495,e),o=s.pitch==54?1:2,l.gain.setValueAtTime(n*o/2,e),l.gain.linearRampToValueAtTime(n*o,e+g),l.gain.setTargetAtTime(0,e+g,.05),m=.3;break}case 58:{a.playbackRate.setValueAtTime(.6,e),a.playbackRate.linearRampToValueAtTime(1,e+.8);const o=40;i.gain.setValueAtTime(n*1.5,e),l.gain.setValueAtTime(n*.5,e);for(let g=0;g<o;g++)i.gain.linearRampToValueAtTime(n*.1*(o-g)/o,e+g/o*.8),i.gain.linearRampToValueAtTime(n*1.5*(o-(g+1))/o,e+(g+.99)/o*.8),l.gain.linearRampToValueAtTime(n*.025*(o-g)/o,e+g/o*.8),l.gain.linearRampToValueAtTime(n*.25*(o-(g+1))/o,e+(g+.99)/o*.8);i.gain.linearRampToValueAtTime(0,e+.8),l.gain.linearRampToValueAtTime(0,e+.8),h=.8,r.type="triangle",r.frequency.setValueAtTime(1e3,e),m=.8;break}case 65:case 66:{const o=s.pitch==65?.22:.25;a.playbackRate.setValueAtTime(s.pitch==65?.25:.22,e),a.playbackRate.linearRampToValueAtTime(s.pitch==65?.2:.18,e+o),i.gain.setValueAtTime(n*1.3,e),i.gain.linearRampToValueAtTime(n*.2,e+o/3.5),i.gain.linearRampToValueAtTime(0,e+o),h=o,r.type="triangle",r.frequency.setValueAtTime(s.pitch==65?190*1.07:136*1.07,e),r.frequency.linearRampToValueAtTime(s.pitch==65?190:136,e+.1),l.gain.setValueAtTime(n*3.2,e),l.gain.setTargetAtTime(0,e,.08),m=1;break}case 67:case 68:{a.playbackRate.value=1,i.gain.setValueAtTime(n*.5,e),i.gain.linearRampToValueAtTime(n*.1,e+.02),i.gain.linearRampToValueAtTime(0,e+.08),h=.08,r.type="triangle",r.frequency.setValueAtTime(s.pitch==67?1430:1055,e),l.gain.setValueAtTime(n*2,e),l.gain.setTargetAtTime(0,e,.06),m=.75;break}case 69:{a.playbackRate.value=1,i.gain.setValueAtTime(n*.3,e),i.gain.linearRampToValueAtTime(n*.8,e+.03),i.gain.linearRampToValueAtTime(0,e+.08),h=.08,l.gain.value=0,m=0;break}case 70:{a.playbackRate.value=1,i.gain.setValueAtTime(n*1.2,e),i.gain.linearRampToValueAtTime(0,e+.06),h=.06,l.gain.value=0,m=0;break}case 71:case 72:{i.gain.value=0,h=0;const o=s.pitch==71?.07:.4;r.type="triangle",r.frequency.setValueAtTime(s.pitch==71?2408:2105,e),l.gain.setValueAtTime(0,e);for(let g=0;g<o*74;g++)l.gain.linearRampToValueAtTime(n*2.5,e+(g+.2)/75),l.gain.linearRampToValueAtTime(n*.5,e+(g+.9)/75);l.gain.linearRampToValueAtTime(0,e+o),m=o;break}case 73:case 74:{const o=s.pitch==73?.05:.35;a.playbackRate.setValueAtTime((s.pitch==73,.2),e),a.playbackRate.linearRampToValueAtTime(s.pitch==73?.7:.5,e+o),i.gain.value=n*.2;for(let g=0;g<o*100;g++)i.gain.setValueAtTime(n*.4,e+g/100),i.gain.setValueAtTime(n*.9,e+(g+.7)/100);h=o,l.gain.value=0,m=0;break}case 76:case 77:{a.playbackRate.value=.1,i.gain.setValueAtTime(n*1.2,e),i.gain.linearRampToValueAtTime(0,e+.015),h=.015,r.frequency.setValueAtTime(s.pitch==76?800:600,e),l.gain.setValueAtTime(0,e),l.gain.linearRampToValueAtTime(n*3,e+.005),l.gain.setTargetAtTime(0,e+.005,.02),m=.2;break}case 78:case 79:{i.gain.value=0,h=0;const o=.18,g=s.pitch==78?750:270;r.frequency.setValueAtTime(g,e),r.frequency.linearRampToValueAtTime(g,e+o/3),s.pitch==78&&r.frequency.linearRampToValueAtTime(g*.9,e+o),l.gain.setValueAtTime(0,e),l.gain.linearRampToValueAtTime(n*1.5,e+.005),l.gain.linearRampToValueAtTime(n*.5,e+.02),l.gain.linearRampToValueAtTime(n*3,e+.04),l.gain.linearRampToValueAtTime(n*2,e+o/4*3),l.gain.linearRampToValueAtTime(0,e+o),m=o;break}case 27:{a.playbackRate.value=1,i.gain.setValueAtTime(n*1,e),i.gain.linearRampToValueAtTime(0,e+.002),h=.002,r.frequency.setValueAtTime(1500,e),r.frequency.linearRampToValueAtTime(280,e+.015),r.frequency.linearRampToValueAtTime(0,e+.07),l.gain.setValueAtTime(n*1.9,e),l.gain.linearRampToValueAtTime(0,e+.07),m=.07;break}case 28:{a.playbackRate.value=1,i.gain.setValueAtTime(n*1.3,e),i.gain.linearRampToValueAtTime(0,e+.01),i.gain.setValueAtTime(n*1.1,e+.0101),i.gain.linearRampToValueAtTime(0,e+.02),i.gain.setValueAtTime(n*.9,e+.0201),i.gain.setTargetAtTime(0,e+.0201,.03),h=.2,l.gain.value=0,m=0;break}case 29:case 30:{const o=s.pitch==29?.05:.07,g=s.pitch==29?.06:.09,M=s.pitch==29?.07:.11,x=s.pitch==29?.1:.15,T=s.pitch==29?.25:.4,p=s.pitch==29?.1:.06,d=s.pitch==29?.3:.2,O=s.pitch==29?.18:.12;a.playbackRate.setValueAtTime(p,e),a.playbackRate.linearRampToValueAtTime(d,e+o),a.playbackRate.linearRampToValueAtTime(0,e+g),a.playbackRate.linearRampToValueAtTime(d,e+M),a.playbackRate.linearRampToValueAtTime(O,e+x),a.playbackRate.linearRampToValueAtTime(0,e+T),i.gain.setValueAtTime(0,e),i.gain.linearRampToValueAtTime(n*.4,e+o),i.gain.linearRampToValueAtTime(n*.1,e+M),i.gain.linearRampToValueAtTime(n*.3,e+x),i.gain.linearRampToValueAtTime(0,e+T),h=T;const I=s.pitch==29?500:400,k=s.pitch==29?1950:1200,y=s.pitch==29?430:250;r.frequency.setValueAtTime(I,e),r.frequency.linearRampToValueAtTime(k,e+o),r.frequency.linearRampToValueAtTime(0,e+g),r.frequency.linearRampToValueAtTime(k,e+M),r.frequency.linearRampToValueAtTime(y,e+x),r.frequency.linearRampToValueAtTime(0,e+T),l.gain.setValueAtTime(0,e),l.gain.linearRampToValueAtTime(n*.7,e+o),l.gain.linearRampToValueAtTime(n*.2,e+M),l.gain.linearRampToValueAtTime(n*.6,e+x),l.gain.linearRampToValueAtTime(0,e+T),m=T;break}case 31:{a.playbackRate.setValueAtTime(.4,e),a.playbackRate.linearRampToValueAtTime(.5,e+.015),i.gain.setValueAtTime(n*1.2,e),i.gain.setTargetAtTime(0,e,.035),h=.3,r.frequency.setValueAtTime(3140,e),l.gain.setValueAtTime(n*1.2,e),l.gain.setTargetAtTime(0,e,.012),m=.3;break}case 32:{i.gain.value=0,h=0,r.type="square",r.frequency.setValueAtTime(333,e),l.gain.setValueAtTime(0,e),l.gain.linearRampToValueAtTime(n*4,e+.0016),l.gain.linearRampToValueAtTime(0,e+.0032),m=.0032;break}case 33:case 34:{a.playbackRate.setValueAtTime(.17,e),a.playbackRate.linearRampToValueAtTime(.22,e+.01),i.gain.setValueAtTime(n*1.5,e),i.gain.setTargetAtTime(0,e,.015),h=.3,s.pitch==34?(r.frequency.setValueAtTime(2040,e),l.gain.setValueAtTime(n*1,e),l.gain.setTargetAtTime(0,e,.12),m=1.1):(l.gain.value=0,m=0);break}case 82:{a.playbackRate.value=1,i.gain.setValueAtTime(n*.5,e),i.gain.linearRampToValueAtTime(n,e+.02),i.gain.linearRampToValueAtTime(0,e+.07),h=.07,l.gain.value=0,m=0;break}case 83:{a.playbackRate.value=1,i.gain.setValueAtTime(0,e),i.gain.linearRampToValueAtTime(n*1.2,e+.015),i.gain.setTargetAtTime(0,e+.015,.06),h=.5,r.type="triangle",r.frequency.setValueAtTime(2709,e),r.frequency.linearRampToValueAtTime(2657,e+.3),l.gain.setValueAtTime(0,e),l.gain.linearRampToValueAtTime(n*.7,e+.025),l.gain.setTargetAtTime(0,e+.025,.07),m=.5;break}case 84:{a.playbackRate.value=1;for(let o=0;o<28;o++)i.gain.setValueAtTime(n*.1,e+o/24*.45),i.gain.setTargetAtTime(0,e+o/24*.45,.01),r.frequency.setValueAtTime(1380*(1+o/24),e+o/24*.45),l.gain.setValueAtTime(n*(.2+o/24),e+o/24*.45),l.gain.setTargetAtTime(0,e+o/24*.45,o==27?.2:.01);h=.5,m=1.5;break}case 85:{a.playbackRate.setValueAtTime(.35,e),i.gain.setValueAtTime(n*1.3,e),i.gain.setTargetAtTime(0,e,.01),h=.1,r.frequency.setValueAtTime(1730,e),l.gain.setValueAtTime(n*.5,e),l.gain.setTargetAtTime(0,e,.01),m=.1;break}case 86:case 87:{a.playbackRate.setValueAtTime(.02,e),a.playbackRate.linearRampToValueAtTime(.015,e+.5),i.gain.setValueAtTime(0,e),i.gain.linearRampToValueAtTime(n*2,e+.005),i.gain.setTargetAtTime(0,e+.005,s.pitch==86?.03:.06),h=.5,r.frequency.setValueAtTime(88,e),r.frequency.linearRampToValueAtTime(86,e+.3),l.gain.setValueAtTime(n*2.5,e),l.gain.setTargetAtTime(0,e,s.pitch==86?.1:.3),m=s.pitch==86?.5:1.5;break}default:{a.playbackRate.value=s.pitch/69*2,h=.05,m=0;break}}return!this.settings.isSameDrumSoundOverlap&&V!=-1&&(h>V&&(h=V),m>V&&(m=V)),this.stopAudioNode(a,e+h,c),this.stopAudioNode(r,e+m,b),s.drumStopTime=s.startTime+(h>=m?h:m),()=>{this.stopAudioNode(a,0,c,!0),this.stopAudioNode(r,0,b,!0)}}function he(s,t,a,i){const c=t<=this.context.currentTime;let e=t-.005,n=t;c&&(i?(e=this.context.currentTime,n=this.context.currentTime+.005):n=this.context.currentTime);try{i?(s.stop(n),a.gain.cancelScheduledValues(0),a.gain.setValueAtTime(1,e),a.gain.linearRampToValueAtTime(0,n)):s.stop(n)}catch(u){a.gain.cancelScheduledValues(0),i?(a.gain.setValueAtTime(1,e),a.gain.linearRampToValueAtTime(0,n)):a.gain.setValueAtTime(0,n)}}function Te(s){!s.note&&!s.rootTimeout&&!s.pan&&!this.trigger.isNoteTrigger||this.states.stopFuncs.push(s)}function ge(s,t){s!="note"&&s!="rootTimeout"&&s!="pan"&&!this.trigger.isNoteTrigger||this.states.stopFuncs.some((a,i,c)=>{if(a[s]==t)return q.delete(c,i),!0})}function pe(s){let t=-1;if(this.tempoTrack&&this.tempoTrack.length>=1){if(s>=this.tempoTrack[this.tempoTrack.length-1].timing)return this.tempoTrack[this.tempoTrack.length-1].time;let e=0,n=this.tempoTrack.length-1;for(;;){t=Math.floor(e+(n-e)/2);const u=this.tempoTrack[t].timing;if(s<u)n=t-1;else if(s>u)e=t+1;else break;if(e>n){s<u&&t--;break}}}let a=0,i=0,c=120;if(t>=0){const e=this.tempoTrack[t];a=e.time,i=e.timing,c=e.value}return a+=60/c/this.settings.resolution*(s-i),a}function fe(s){let t=-1;if(this.tempoTrack&&this.tempoTrack.length>=1){if(s>=this.tempoTrack[this.tempoTrack.length-1].time)return this.tempoTrack[this.tempoTrack.length-1].timing;let e=0,n=this.tempoTrack.length-1;for(;;){t=Math.floor(e+(n-e)/2);const u=this.tempoTrack[t].time;if(s<u)n=t-1;else if(s>u)e=t+1;else break;if(e>n){s<u&&t--;break}}}let a=0,i=0,c=120;if(t>=0){const e=this.tempoTrack[t];a=e.time,i=e.timing,c=e.value}return i+=(s-a)/(60/c/this.settings.resolution),i}function de(s){const t=s.smf;let a=4;const i={};i.size=L.getInt(t,4,8),i.format=t[9],i.trackcount=L.getInt(t,10,12),i.timemanage=t[12],i.resolution=L.getInt(t,12,14),a+=4+i.size;const c=[],e=this.settings.isWebMIDI?17:16;for(let n=0;n<e;n++){const u={};c.push(u),u.indices=[],u.indicesLength=0,u.indicesHead=-1,u.indicesFoot=0,u.indicesCur=0,u.indicesPre=0,u.notes=[]}return s.p=a,s.header=i,s.channels=c,s}function Ae(s){const t=s.smf;let a=s.p;const i=s.header,c=s.channels,e=[],n=[];let u=0;for(let r=0;r<i.trackcount;r++){if(t[a]!=77||t[a+1]!=84||t[a+2]!=114||t[a+3]!=107)return"Irregular SMF.";a+=4;const l=a+4+L.getInt(t,a,a+4);a+=4;let b=0,V=120,h=0,m=0,o=1,g;for(;a<l;){if(o!=null){const T=L.variableLengthToInt(t,a,a+5);g=T[0],b+=g,a+=T[1]}const M=a;switch(t[a]>>4){case 8:case 9:case 10:case 11:case 14:{o=t[a];const T=c[o&15];L.chIndicesInsert(this,T,b,a,3),a+=3;break}case 12:case 13:{o=t[a];const T=c[o&15];L.chIndicesInsert(this,T,b,a,2),a+=2;break}case 15:{switch(t[a]){case 240:case 247:{const T=L.variableLengthToInt(t,a+1,a+1+4);if(T[0]>=7&&t[a+2]==127&&t[a+3]==127&&t[a+4]==4&&t[a+5]==1)for(let p=0;p<16;p++){const d=c[p];L.chIndicesInsert(this,d,b,a,T[0])}a+=1+T[1]+T[0];break}case 241:a+=2;break;case 242:a+=3;break;case 243:a+=2;break;case 246:case 248:case 250:case 251:case 252:case 254:a+=1;break;case 255:{switch(t[a+1]){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 32:break;case 47:b+=(this.settings.isSkipEnding?0:i.resolution)-g;break;case 81:for(let p=0;p<16;p++){const d=c[p];L.chIndicesInsert(this,d,b,a,6)}m+=60/V/i.resolution*(b-h),h=b,V=6e7/(t[a+3]*65536+t[a+4]*256+t[a+5]),e.push({timing:b,time:m,value:V});break;case 84:break;case 88:n.push({timing:b,value:[t[a+3],Math.pow(2,t[a+4])]});break}const T=L.variableLengthToInt(t,a+2,a+2+4);a+=2+T[1]+T[0];break}}break}default:{if(o==null)return"Irregular SMF. ("+a+" byte addr)";a--,t[a]=o,o=null}}this.settings.isWebMIDI&&o!=null&&L.chIndicesInsert(this,c[16],b,M,a-M)}!this.settings.isSkipEnding&&u<b&&(u=b);for(let M=0;M<c.length;M++)c[M].indicesCur=c[M].indicesHead,c[M].indicesPre=c[M].indicesHead}return s.p=a,s.tempoTrack=e,s.beatTrack=n,s.songLength=u,s}function be(s){const t=s.smf,a=s.header,i=s.channels,c=s.tempoTrack;let e=s.songLength,n,u,r,l=-1,b=-1,V=U,h=U,m=0,o=0,g=0,M=0;for(let T=0;T<16;T++){const p=i[T];let d=2,O=0,I=64,k=127,y=100,f=0,A=0,N=this.settings.initReverb,w=0,B=127,C=127,G=127,$=127,ee=0,_=127;n=120,u=0,r=0;const S=[];let z=p.indicesHead;const j=p.indices,te=new Array(128);for(;z!=-1;){const R=j[z],v=j[z+2],xe=j[z+3],D=60/n/a.resolution*(R-u)+r,ae=t[v]>>4;switch(ae){case 8:case 9:if(ae==9&&t[v+2]!=0){const P={start:R,stop:null,startTime:D,stopTime:null,pitch:t[v+1],pitchBend:[{timing:R,time:D,value:O}],pan:[{timing:R,time:D,value:I}],expression:[{timing:R,time:D,value:k*(_/127)}],velocity:t[v+2]/127*(y/127),modulation:[{timing:R,time:D,value:f}],holdBeforeStop:null,reverb:[{timing:R,time:D,value:N}],chorus:[{timing:R,time:D,value:w}],instrument:ee,channel:T,nextSameNoteOnInterval:-1,drumStopTime:2},F=te[t[v+1]];F&&(F.nextSameNoteOnInterval=D-F.startTime),te[t[v+1]]=P,S.some((E,Ie)=>{const Z=p.notes[E];Z.pitch==t[v+1]&&Z.stop==null&&(Z.stop=R,Z.stopTime=D,q.delete(S,Ie))}),S.push(p.notes.length),p.notes.push(P),R<V&&(V=R,h=D)}else S.some((P,F)=>{const E=p.notes[P];if(E.pitch==t[v+1]&&E.stop==null)return A>=this.settings.holdOnValue?E.holdBeforeStop==null&&(E.holdBeforeStop=[{timing:R,time:D,value:A}]):(E.stop=R,E.stopTime=D,q.delete(S,F)),R>m&&(m=R,o=D),!0});break;case 10:break;case 11:switch(t[v+1]){case 1:f=t[v+2],S.forEach(P=>{p.notes[P].modulation.push({timing:R,time:D,value:f})});break;case 6:G==0&&$==0&&(d=t[v+2],d>24&&(d=24));break;case 7:y=t[v+2];break;case 10:I=t[v+2],S.forEach(P=>{p.notes[P].pan.push({timing:R,time:D,value:I})});break;case 11:k=t[v+2],S.forEach(P=>{p.notes[P].expression.push({timing:R,time:D,value:k*(_/127)})});break;case 64:if(A=t[v+2],A<this.settings.holdOnValue)for(let P=S.length-1;P>=0;P--){const F=S[P],E=p.notes[F];E.stop==null&&E.holdBeforeStop!=null&&(E.stop=R,E.stopTime=D,q.delete(S,P))}break;case 91:N=t[v+2],S.forEach(P=>{p.notes[P].reverb.push({timing:R,time:D,value:N})});break;case 93:w=t[v+2],S.forEach(P=>{p.notes[P].chorus.push({timing:R,time:D,value:w})});break;case 98:B=t[v+2];break;case 99:C=t[v+2];break;case 100:G=t[v+2];break;case 101:$=t[v+2];break;case 111:l==-1&&(l=R,b=D);break}break;case 12:ee=t[v+1];break;case 13:break;case 14:O=(t[v+2]*128+t[v+1]-8192)/8192*d,S.forEach(P=>{p.notes[P].pitchBend.push({timing:R,time:D,value:O})});break;case 15:switch(t[v]){case 240:case 247:if(t[v+1]==127&&t[v+2]==127&&t[v+3]==4&&t[v+4]==1){let P=t[v+6];P>127&&(P=127),_=P,S.forEach(F=>{p.notes[F].expression.push({timing:R,time:D,value:k*(_/127)})})}break;case 255:switch(t[v+1]){case 81:r+=60/n/a.resolution*(R-u),u=R,n=6e7/(t[v+3]*65536+t[v+4]*256+t[v+5]);break}break}break;default:return"Error parseSMF. "}z=xe,R>g&&(g=R,M=D)}p.nowNoteOnIdxAry=S,this.debug||delete p.indices}for(let T=0;T<16;T++){const p=i[T],d=p.nowNoteOnIdxAry;for(let O=d.length-1;O>=0;O--){const I=p.notes[d[O]];I.stop==null&&(I.stop=m,I.stopTime=o,["pitchBend","pan","expression","modulation","reverb","chorus"].forEach(y=>{const f=I[y];for(let A=f.length-1;A>=1;A--)f[A].timing>m&&q.delete(f,A)}),q.delete(d,O))}delete p.nowNoteOnIdxAry}this.settings.isSkipEnding&&(e=m),this.settings.isCC111&&b!=-1&&(e=g),c.push({timing:e,time:60/n/a.resolution*(e-u)+r,value:120});const x=[];if(this.settings.isWebMIDI){const T=i[16];let p=120,d=0,O=0,I=T.indicesHead;const k=T.indices;for(;I!=-1;){const y=k[I],f=k[I+1],A=k[I+2],N=k[I+3],w=60/p/a.resolution*(y-d)+O;switch(t[A]){case 255:switch(t[A+1]){case 81:O+=60/p/a.resolution*(y-d),d=y,p=6e7/(t[A+3]*65536+t[A+4]*256+t[A+5]);break}}x.push({time:w,tick:y,smfPtr:A,smfPtrLen:f}),I=N}}return s.songLength=e,s.cc111Tick=l,s.cc111Time=b,s.firstNoteOnTiming=V,s.firstNoteOnTime=h,s.lastNoteOffTiming=m,s.lastNoteOffTime=o,s.lastEventTiming=g,s.lastEventTime=M,this.settings.isWebMIDI&&(s.messages=x,s.smfData=new Uint8Array(t)),s}function Ve(s){if(this.debug){console.log(s);var t=W.now()}const a=new Uint8Array(s);if(a[0]!=77||a[1]!=84||a[2]!=104||a[3]!=100)return"Not Sandard MIDI File.";const i={};if(i.smf=a,de.call(this,i),this.debug)var c=W.now();if(Ae.call(this,i),this.debug)var e=W.now();be.call(this,i);const n={};if(n.header=i.header,n.tempoTrack=i.tempoTrack,n.beatTrack=i.beatTrack,n.channels=i.channels,n.songLength=i.songLength,n.cc111Tick=i.cc111Tick,n.cc111Time=i.cc111Time,n.firstNoteOnTiming=i.firstNoteOnTiming,n.firstNoteOnTime=i.firstNoteOnTime,n.lastNoteOffTiming=i.lastNoteOffTiming,n.lastNoteOffTime=i.lastNoteOffTime,n.lastEventTiming=i.lastEventTiming,n.lastEventTime=i.lastEventTime,this.settings.isWebMIDI&&(n.messages=i.messages,n.smfData=new Uint8Array(a)),this.debug){const u=W.now();console.log("parseSMF time",u-t),console.log("parseSMF(0/2) time",c-t),console.log("parseSMF(1/2) time",e-c),console.log("parseSMF(2/2) time",u-e),console.log(n)}return n}function ye(){if(!navigator.requestMIDIAccess)return;let s=this.settings.WebMIDIPortSysEx;const t=i=>{const c=i.outputs;this.settings.WebMIDIPortOutputs=c;let e;return this.settings.WebMIDIPort==-1?this.settings.WebMIDIPortOutputs.forEach(n=>{e||(e=n)}):e=this.settings.WebMIDIPortOutputs.get(this.settings.WebMIDIPort),this.settings.WebMIDIPortOutput=e,this.settings.WebMIDIPortSysEx=s,e&&(e.open(),this.initStatus()),c},a=i=>{console.log(i),s&&(s=!1,navigator.requestMIDIAccess({sysex:s}).then(t).catch(a))};navigator.requestMIDIAccess({sysex:s}).then(t).catch(a),window.addEventListener("unload",()=>{for(let i=0;i<16;i++){this.settings.WebMIDIPortOutput.send([176+i,120,0]);for(let c=0;c<128;c++)this.settings.WebMIDIPortOutput.send([128+i,c,0])}})}class ve{constructor(t){ie.call(this,t)}init(t){return se.call(this,t)}parseSMF(t){return Ve.call(this,t)}setData(t){return ne.call(this,t)}play(t){return re.call(this,t)}pause(t){return Q.call(this,t)}stop(t){return Q.call(this,t)}initStatus(t,a){return ce.call(this,t,a)}setStartTime(t){this.states.startTime-=t}getTime(t){return pe.call(this,t)}getTiming(t){return fe.call(this,t)}createBaseNote(t,a,i,c,e){return le.call(this,t,a,i,c,e)}createNote(t){return ue.call(this,t)}createPercussionNote(t){return me.call(this,t)}stopAudioNode(t,a,i,c){return he.call(this,t,a,i,c)}pushFunc(t){return Te.call(this,t)}clearFunc(t,a){return ge.call(this,t,a)}startWebMIDI(){return ye.call(this)}addEventListener(t,a){this.events.push({type:t,func:a})}removeEventListener(t,a){for(let i=this.events.length;i>=0;i--)event.type==t&&event.func===a&&this.events.splice(i,1)}removeAllEventListener(t){for(let a=this.events.length;a>=0;a--)event.type==t&&this.events.splice(a,1)}fireEvent(t,a){this.events.forEach(i=>{if(i.type==t)try{i.func(a)}catch(c){console.log(c)}})}setOnSongEndListener(t){this.onSongEndListener=t}onSongEnd(){this.onSongEndListener&&this.onSongEndListener()||this.settings.loop&&(this.initStatus(!0),this.settings.isCC111&&this.cc111Time!=-1&&this.setStartTime(this.cc111Time),this.play(!0))}getChannels(){return this.channels}setChannels(t){t.forEach((a,i)=>{this.channels[i]=a})}initChannels(){for(let t=0;t<16;t++)this.channels[t]=[0,0,1]}getMasterVolume(){return this.settings.masterVolume}setMasterVolume(t){this.settings.masterVolume=t,this.isStarted&&(this.masterGainNode.gain.value=this.settings.masterVolume)}isLoop(){return this.settings.loop}setLoop(t){this.settings.loop=t}isWebMIDI(){return this.settings.isWebMIDI}setWebMIDI(t){this.settings.isWebMIDI=t}isCC111(){return this.settings.isCC111}setCC111(t){this.settings.isCC111=t}isReverb(){return this.settings.isReverb}setReverb(t){this.settings.isReverb=t}getReverbVolume(){return this.settings.reverbVolume}setReverbVolume(t){this.settings.reverbVolume=t}isChorus(){return this.settings.isChorus}setChorus(t){this.settings.isChorus=t}getChorusVolume(){return this.settings.chorusVolume}setChorusVolume(t){this.settings.chorusVolume=t}}return ve})();

(function() {
  "use strict";
  const PicoAudio = globalThis.__Vendor_PicoAudio;
  const parsePluginStruct = (pluginName, parameters, parameterName) => {
    const value = parameters[parameterName];
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`${pluginName}: ${parameterName} の設定を読めません。`, error);
      return {};
    }
  };
  (() => {
    var _a;
    const PLUGIN_NAME = "H2A_MIDIPlayer";
    const MIDI_PREFIX = "__H2A_MIDI__:";
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    const midiExtension = parameters.fileExtension === "midi" ? "midi" : "mid";
    const configuredGenerateVolume = Number((_a = parameters.generateVolume) != null ? _a : "0.75");
    const generateVolume = Number.isFinite(configuredGenerateVolume) ? Math.max(0, configuredGenerateVolume) : 0.75;
    const normalizeMidiPath = (fileName, expectedFolder) => {
      const path = String(fileName || "").trim().replace(/\\/g, "/");
      if (!path || /^audio\//i.test(path) || /\.(mid|midi)$/i.test(path) || path.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
        throw new Error(
          `${PLUGIN_NAME}: MIDIパスは拡張子を除いた audio/${expectedFolder}/ からの相対パスで指定してください。`
        );
      }
      return path;
    };
    const createMidiBgm = (fileName, volume = 90, loop = true, expectedFolder) => {
      const filePath = normalizeMidiPath(fileName, expectedFolder);
      const marker = `${MIDI_PREFIX}${expectedFolder}:${encodeURIComponent(filePath)}:${loop ? "1" : "0"}`;
      return {
        name: marker,
        volume: Number(volume) || 0,
        pitch: 100,
        pan: 0,
        pos: 0
      };
    };
    const parseMidiBgm = (bgm) => {
      var _a2;
      if (!((_a2 = bgm == null ? void 0 : bgm.name) == null ? void 0 : _a2.startsWith(MIDI_PREFIX))) return null;
      const [folder, encodedName, loopFlag] = bgm.name.slice(MIDI_PREFIX.length).split(":");
      try {
        if (folder !== "bgm" && folder !== "me") return null;
        return {
          folder,
          filePath: decodeURIComponent(encodedName),
          loop: loopFlag !== "0",
          volume: Number(bgm.volume) || 0,
          pitch: Number(bgm.pitch) || 100,
          pan: Number(bgm.pan) || 0,
          pos: Number(bgm.pos) || 0,
          marker: bgm.name
        };
      } catch (_error) {
        return null;
      }
    };
    const isMidiBgm = (bgm) => !!parseMidiBgm(bgm);
    const MidiPlayer = {
      _picoAudio: null,
      _current: null,
      _requestId: 0,
      isBgmPlaying() {
        var _a2;
        return ((_a2 = this._current) == null ? void 0 : _a2.kind) === "bgm";
      },
      isMePlaying() {
        var _a2;
        return ((_a2 = this._current) == null ? void 0 : _a2.kind) === "me";
      },
      isCurrentBgm(bgm) {
        return this.isBgmPlaying() && this._current.bgm.name === bgm.name;
      },
      currentBgm() {
        if (!this.isBgmPlaying()) return null;
        const bgm = { ...this._current.bgm };
        bgm.pos = this.position();
        return bgm;
      },
      position() {
        var _a2, _b;
        const current = this._current;
        if (!current) return 0;
        if ((_b = (_a2 = this._picoAudio) == null ? void 0 : _a2.states) == null ? void 0 : _b.isPlaying) {
          return Math.max(
            0,
            this._picoAudio.context.currentTime - this._picoAudio.states.startTime
          );
        }
        return current.position;
      },
      updateVolume() {
        var _a2;
        if (!this._current || !this._picoAudio) return;
        const bgmVolume = this._current.kind === "bgm" ? AudioManager.bgmVolume : AudioManager.meVolume;
        const masterVolume = (_a2 = WebAudio._masterVolume) != null ? _a2 : 1;
        this._picoAudio.setMasterVolume(
          this._current.bgm.volume / 100 * (bgmVolume / 100) * masterVolume
        );
      },
      _getPicoAudio() {
        if (!this._picoAudio) {
          this._picoAudio = new PicoAudio({
            audioContext: WebAudio._context,
            generateVolume
          });
          this._picoAudio.setCC111(true);
          this._picoAudio.addEventListener("songEnd", () => {
            if (this.isMePlaying()) this.finishMe();
          });
        }
        return this._picoAudio;
      },
      async playBgm(bgm, position = 0) {
        await this._play("bgm", bgm, position);
      },
      async playMe(me, fallbackBgm) {
        await this._play("me", me, 0, fallbackBgm);
      },
      async _play(kind, bgm, position, fallbackBgm = null) {
        const definition = parseMidiBgm(bgm);
        if (!definition) return;
        this.stop(false);
        const requestId = ++this._requestId;
        this._current = {
          kind,
          bgm: { ...bgm },
          position: Number(position) || 0,
          fallbackBgm
        };
        try {
          const url = `${AudioManager._path}${definition.folder}/${Utils.encodeURI(definition.filePath)}.${midiExtension}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (requestId !== this._requestId || !this._current) return;
          const picoAudio = this._getPicoAudio();
          picoAudio.pause();
          picoAudio.initStatus();
          picoAudio.setData(picoAudio.parseSMF(bytes));
          picoAudio.setLoop(kind === "bgm" && definition.loop);
          picoAudio.setStartTime(this._current.position);
          this.updateVolume();
          picoAudio.play();
        } catch (error) {
          if (requestId === this._requestId) {
            console.error(`${PLUGIN_NAME}: MIDIを読み込めません (${definition.filePath})。`, error);
            if (kind === "me") {
              this.finishMe();
            } else {
              AudioManager._currentBgm = null;
              this._current = null;
            }
          }
        }
      },
      stop(clearCurrentBgm = true) {
        var _a2, _b, _c;
        ++this._requestId;
        if ((_b = (_a2 = this._picoAudio) == null ? void 0 : _a2.states) == null ? void 0 : _b.isPlaying) this._picoAudio.pause();
        const kind = (_c = this._current) == null ? void 0 : _c.kind;
        this._current = null;
        if (clearCurrentBgm && kind === "bgm") AudioManager._currentBgm = null;
      },
      fadeOut(duration) {
        var _a2;
        if (!this._current || !((_a2 = this._picoAudio) == null ? void 0 : _a2.masterGainNode)) return;
        const current = this._current;
        const gain = this._picoAudio.masterGainNode.gain;
        const now = this._picoAudio.context.currentTime;
        gain.cancelScheduledValues(now);
        gain.setValueAtTime(gain.value, now);
        gain.linearRampToValueAtTime(0, now + duration);
        AudioManager._currentBgm = null;
        window.setTimeout(() => {
          if (this._current === current) this.stop(false);
        }, duration * 1e3);
      },
      finishMe() {
        if (!this.isMePlaying()) return;
        const current = this._current;
        this.stop(false);
        AudioManager._meBuffer = null;
        const deferred = AudioManager._h2aDeferredMidiBgm;
        AudioManager._h2aDeferredMidiBgm = null;
        const resumeBgm = deferred || current.fallbackBgm;
        if (resumeBgm == null ? void 0 : resumeBgm.bgm) {
          AudioManager.playBgm(resumeBgm.bgm, resumeBgm.pos);
        }
      }
    };
    const _AudioManager_playBgm = AudioManager.playBgm;
    const _AudioManager_replayBgm = AudioManager.replayBgm;
    const _AudioManager_stopBgm = AudioManager.stopBgm;
    const _AudioManager_fadeOutBgm = AudioManager.fadeOutBgm;
    const _AudioManager_isCurrentBgm = AudioManager.isCurrentBgm;
    const _AudioManager_updateBgmParameters = AudioManager.updateBgmParameters;
    const _AudioManager_saveBgm = AudioManager.saveBgm;
    const _AudioManager_playMe = AudioManager.playMe;
    const _AudioManager_stopMe = AudioManager.stopMe;
    const _AudioManager_fadeOutMe = AudioManager.fadeOutMe;
    const _WebAudio_setMasterVolume = WebAudio.setMasterVolume;
    AudioManager.playBgm = function(bgm, pos) {
      if (MidiPlayer.isMePlaying()) {
        this._h2aDeferredMidiBgm = { bgm: { ...bgm }, pos: Number(pos) || 0 };
        this.updateCurrentBgm(bgm, pos);
        return;
      }
      if (this._meBuffer && isMidiBgm(bgm)) {
        this._h2aDeferredMidiBgm = { bgm: { ...bgm }, pos: Number(pos) || 0 };
        this.updateCurrentBgm(bgm, pos);
        return;
      }
      if (isMidiBgm(bgm)) {
        this.stopBgm();
        MidiPlayer.playBgm(bgm, pos);
        this.updateCurrentBgm(bgm, pos);
        return;
      }
      if (MidiPlayer.isBgmPlaying()) MidiPlayer.stop();
      return _AudioManager_playBgm.call(this, bgm, pos);
    };
    AudioManager.replayBgm = function(bgm) {
      if (isMidiBgm(bgm)) {
        if (MidiPlayer.isCurrentBgm(bgm)) {
          this.updateBgmParameters(bgm);
        } else {
          this.playBgm(bgm, bgm.pos);
        }
        return;
      }
      return _AudioManager_replayBgm.call(this, bgm);
    };
    AudioManager.stopBgm = function() {
      if (MidiPlayer.isBgmPlaying()) {
        MidiPlayer.stop();
        return;
      }
      return _AudioManager_stopBgm.call(this);
    };
    AudioManager.fadeOutBgm = function(duration) {
      if (MidiPlayer.isBgmPlaying()) {
        MidiPlayer.fadeOut(duration);
        return;
      }
      return _AudioManager_fadeOutBgm.call(this, duration);
    };
    AudioManager.isCurrentBgm = function(bgm) {
      if (isMidiBgm(bgm)) return MidiPlayer.isCurrentBgm(bgm);
      return _AudioManager_isCurrentBgm.call(this, bgm);
    };
    AudioManager.updateBgmParameters = function(bgm) {
      _AudioManager_updateBgmParameters.call(this, bgm);
      if (isMidiBgm(bgm)) MidiPlayer.updateVolume();
    };
    AudioManager.saveBgm = function() {
      return MidiPlayer.currentBgm() || _AudioManager_saveBgm.call(this);
    };
    AudioManager.playMe = function(me) {
      if (isMidiBgm(me)) {
        const fallbackBgm = this.saveBgm();
        this.stopMe();
        this.stopBgm();
        this._meBuffer = { h2aMidi: true };
        MidiPlayer.playMe(me, fallbackBgm.name ? { bgm: fallbackBgm, pos: fallbackBgm.pos } : null);
        return;
      }
      if (MidiPlayer.isBgmPlaying()) {
        this._h2aMidiResumeBgm = this.saveBgm();
        MidiPlayer.stop();
      }
      return _AudioManager_playMe.call(this, me);
    };
    AudioManager.stopMe = function() {
      if (MidiPlayer.isMePlaying()) {
        MidiPlayer.stop(false);
        this._meBuffer = null;
        return;
      }
      const hadMe = !!this._meBuffer;
      const result = _AudioManager_stopMe.call(this);
      if (hadMe) {
        const resumeBgm = this._h2aMidiResumeBgm;
        this._h2aMidiResumeBgm = null;
        if ((resumeBgm == null ? void 0 : resumeBgm.name) && !this._h2aDeferredMidiBgm) {
          this.replayBgm(resumeBgm);
        }
      }
      return result;
    };
    AudioManager.fadeOutMe = function(duration) {
      if (MidiPlayer.isMePlaying()) {
        MidiPlayer.fadeOut(duration);
        window.setTimeout(() => MidiPlayer.finishMe(), duration * 1e3);
        return;
      }
      return _AudioManager_fadeOutMe.call(this, duration);
    };
    WebAudio.setMasterVolume = function(value) {
      _WebAudio_setMasterVolume.call(this, value);
      MidiPlayer.updateVolume();
    };
    const makeConfiguredBgm = (parameterName, loop, folder) => {
      const config = parsePluginStruct(PLUGIN_NAME, parameters, parameterName);
      return config.fileName ? createMidiBgm(config.fileName, config.volume, loop, folder) : null;
    };
    const applySystemOverrides = () => {
      const titleBgm = makeConfiguredBgm("titleBgm", true, "bgm");
      const battleBgm = makeConfiguredBgm("battleBgm", true, "bgm");
      const victoryMe = makeConfiguredBgm("victoryMe", false, "me");
      const defeatMe = makeConfiguredBgm("defeatMe", false, "me");
      const gameoverMe = makeConfiguredBgm("gameoverMe", false, "me");
      const boatBgm = makeConfiguredBgm("boatBgm", true, "bgm");
      const shipBgm = makeConfiguredBgm("shipBgm", true, "bgm");
      const airshipBgm = makeConfiguredBgm("airshipBgm", true, "bgm");
      if (titleBgm) $dataSystem.titleBgm = titleBgm;
      if (battleBgm) $dataSystem.battleBgm = battleBgm;
      if (victoryMe) $dataSystem.victoryMe = victoryMe;
      if (defeatMe) $dataSystem.defeatMe = defeatMe;
      if (gameoverMe) $dataSystem.gameoverMe = gameoverMe;
      if (boatBgm) $dataSystem.boat.bgm = boatBgm;
      if (shipBgm) $dataSystem.ship.bgm = shipBgm;
      if (airshipBgm) $dataSystem.airship.bgm = airshipBgm;
    };
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
      _DataManager_onLoad.call(this, object);
      if (object === $dataSystem) applySystemOverrides();
    };
    PluginManager.registerCommand(PLUGIN_NAME, "play", (args) => {
      const bgm = createMidiBgm(args.fileName, args.volume, args.loop !== "false", "bgm");
      if (bgm) AudioManager.playBgm(bgm);
    });
    PluginManager.registerCommand(PLUGIN_NAME, "stop", () => {
      AudioManager.stopBgm();
    });
    PluginManager.registerCommand(PLUGIN_NAME, "playMe", (args) => {
      const me = createMidiBgm(args.fileName, args.volume, false, "me");
      if (me) AudioManager.playMe(me);
    });
    PluginManager.registerCommand(PLUGIN_NAME, "setBattleBgm", (args) => {
      const bgm = createMidiBgm(args.fileName, args.volume, true, "bgm");
      if (bgm) $gameSystem.setBattleBgm(bgm);
    });
    PluginManager.registerCommand(PLUGIN_NAME, "setVehicleBgm", (args) => {
      var _a2;
      const bgm = createMidiBgm(args.fileName, args.volume, true, "bgm");
      const vehicle = (_a2 = $gameMap == null ? void 0 : $gameMap[args.vehicle]) == null ? void 0 : _a2.call($gameMap);
      if (bgm && vehicle) vehicle.setBgm(bgm);
    });
  })();
})();

delete globalThis.__Vendor_PicoAudio;
