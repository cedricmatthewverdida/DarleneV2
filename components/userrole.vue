<template>
  <div>


    <v-alert
      prominent
      v-if="!$auth.loggedIn"
      type="error"
    >
      <v-row align="center">
        <v-col class="grow">
          You are accessing it as a guest you cannot submit or train a AI loggin is required
        </v-col>
        <v-col class="shrink">
          <v-btn  text to="/">
            <v-icon>mdi-login</v-icon>&nbsp;
            Click to login
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <div class="mt-5">

      <div class="d-flex flex-row">

        <v-combobox
            :disabled="!searchactiveStatus || searchStat || versionSearch == '' && searchactivetype == 'version' "
            v-model="search"
            :items="items"
            label="Search keyword"
            hide-details 
            placeholder="...." 
            persistent-hint
            filled
            prepend-inner-icon="mdi-magnify"
            rounded 
            @keyup.enter="initiate_search"
            :loading="load"
        ></v-combobox>

          <v-btn
            fab
            depressed
            v-if="searchStat"
            @click="Resets"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

        </div
        
        >
        <div class="d-flex flex-row mb-6">
          
          <v-select
            v-model="searchactivetype"
            :items="searchtype"
            label="Select Type"
            filled
            rounded
            class="mt-2 qq"
            v-if="!searchactiveStatus"
          ></v-select>

            <v-btn
            fab
            depressed
            class="mt-2 ml-1"
            @click="searchactiveStatus = true"
            v-if="searchactivetype != '' && !searchactiveStatus"
            >
            <v-icon>mdi-check</v-icon>
          </v-btn>
          
  <!-- Version Search -->
          <v-select
            v-model="versionSearch"
            v-if="searchactiveStatus && searchactivetype == 'version'"
            :items="userVersion"
            :loading="versionload"
            label="Select version"
            filled
            rounded
            :disabled="searchStat"
            prepend-inner-icon="mdi-database-search"
            class="mt-2 qq"
          >
          </v-select>


          
  <!-- Version Search -->


    <!-- Tweepy Search -->

          <v-select
            v-model="activecategory"
            v-if="searchactiveStatus"
            :items="category"
            label="Category"
            filled
            rounded
            prepend-inner-icon="mdi-robot"
            :disabled="!tweepysearchmode"
            class="mt-2 qq"
          ></v-select>

          <v-switch class="ml-3"
            v-if="searchactiveStatus && searchactivetype == 'tweepy'"
            v-model="tweepysearchmode"
            inset
            :disabled="searchStat"
            :label="`Search mode: ${this.tweepysearchmode ? 'Advanced search' : 'Normal search'}`"
          ></v-switch>

          <v-switch class="ml-3"
            v-if="searchactiveStatus && searchactivetype == 'version' "
            v-model="tweepysearchmode"
            inset
            :disabled="searchStat || versionSearch == ''"
            :label="`Search mode: ${this.tweepysearchmode ? 'Advanced search' : 'Normal search'}`"
          ></v-switch>

  <!-- Tweepy Search -->
          
       

        </div>
    </div>

    

    
    <div v-if="tweetObj.length != 0">
    <template>

          <v-slide-group
            v-model="Approve"
            center-active
            show-arrows
          >
            <v-slide-item
              v-for="(tweet,n) in this_act_as_search_engine_mode"
              :key="n"
              v-slot="{ toggle }"
            >
              <v-card
                
                class="ma-4"
                height="460"
                width="300"

              >

              <v-card-title>
                


                <v-icon small color="red" v-if="('faveCount' in tweet)">
                  mdi-cards-heart
                </v-icon>
                <span v-if="('faveCount' in tweet)" class="caption ml-2 mr-2">{{tweet.faveCount | numberFormat}}</span>

                <v-icon small v-if="('rtCount' in tweet)">
                  mdi-twitter-retweet
                </v-icon>
                <span v-if="('rtCount' in tweet)" class="caption ml-2 mr-2">{{tweet.rtCount | numberFormat}}</span>
                
                <v-icon small>
                  mdi-label-outline
                </v-icon>
                <span class="caption ml-2">{{tweet.label}}</span>

                <v-spacer></v-spacer>
                
                <v-btn
                  class="mx-2"
                  icon
                  small
                  v-if="('tweetLink' in tweet)"
                  :href="tweet.tweetLink" target="_blank"
                >
                  <v-icon>
                    mdi-link
                  </v-icon>
                </v-btn>


                <v-btn
                  v-if="$auth.loggedIn"
                  class="mx-2"
                  icon
                  small
                  @click="()=> {
                    EditClassification = true,
                    activeToEditClass = n
                  }"
                  color="danger"
                >
                  <v-icon>
                    mdi-circle-edit-outline
                  </v-icon>
                </v-btn>



                <v-btn
                  v-if="$auth.loggedIn"
                  class="mx-2"
                  icon
                  small
                  @click="()=> {
                    addToList(n),
                    snackbar = true
                  }"
                  color="danger"
                >
                  <v-icon>
                    mdi-check
                  </v-icon>
                </v-btn>

                


              </v-card-title>
              
                <v-row
                  class="fill-height pa-5 text-center"
                  align="center"
                  justify="center"
                >
              

           
                
                <v-sheet
                  height="40"
                  width="100"
                  v-if="('imageUrl' in tweet)"
                >

                  <v-avatar size="70">
                    <v-img
                    rounded
                    :src="tweet.imageUrl"
                    :lazy-src="tweet.imageUrl">
                    </v-img>
                  </v-avatar>
                
                <div class="pa-1 caption" v-if="('tweetAuthor' in tweet)">
                  <v-icon small>
                    mdi-clock-time-eight-outline
                  </v-icon><span class="caption ml-2">{{tweet.tweetTime | dateDayAgo}}</span>
                
                    @{{tweet.tweetAuthor}}
                 </div>
                </v-sheet>

                <v-sheet
                  height="190"
                  width="400"
                  class="pa-5"
                  style="cursor:pointer;"
                  @click="toggle"
                >

                {{tweet.tweetText | limitString}}

                </v-sheet>
                </v-row>
              </v-card>
            </v-slide-item>
          </v-slide-group>
    </template>
    </div>
    <div class="d-flex justify-center" v-else>
      <v-img 
      max-height="500"
      max-width="800"
      :src="require('@/assets/searching.png')"
      >
      </v-img>
    </div>


    <v-container class="mb-10">
        <div class="float-end">
          <Approvetweets :list="Approvelist" v-if="Approvelist.length != 0"/>
        </div>
    </v-container>

    

    <v-dialog
        v-model="EditClassification"
        persistent
        max-width="500px"
    >
        <v-card>
          <v-card-title>
            Edit Classification
          </v-card-title>
          <v-card-text class="pa-5">

            <v-select
            v-model="editClassText"
            :items="category"
            label="Classifications"
            rounded
            solo
            class="mt-2"
          ></v-select>


          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="EditClassification = false"
            >
              Close
            </v-btn>

            <v-btn
              :disabled="editClassText == ''"
              color="primary"
              text
              @click="()=> {
                addToList_edited_key(),
                EditClassification = false,
                snackbar = true
              }"
            >
              Add to archive
            </v-btn>

          </v-card-actions>
        </v-card>
    </v-dialog>

        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          rounded="pill"
          color="deep-purple accent-4"
        >
        <v-icon>
          mdi-twitter
        </v-icon>

          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>


  </div>
</template>

<script>
  import moment from 'moment';
  import Approvetweets from '~/components/approvetweet.vue'
  export default {
    components : {
      Approvetweets
    },
    data: () => ({
      EditClassification: false,
      activeToEditClass: null,
      editClassText: '',
      snackbar: false,
      searchStat: false,
      text: 'Added to tweet list!',
      timeout: 1000,
      search: '',
      tweetObj: [],
      Approve:null,
      Approvelist:[],
      items: [
          '#TyphoonName',
          '#RescuePH',
          '#ReliefPH',
          '#SafeNow',
          '#SafeNow',
      ],

      
      category: [
          'Others',
          'Announcement',
          'Call for Help',
          'Casualty and Damage'
      ],

      searchtype: [
        'version',
        'tweepy'
      ],

      /**
       * searchactivetype = returns normal or tweepy mode
       * searchactivestatus = to confirm mode selection and enabled searchbox
       */
      searchactivetype:'',
      searchactiveStatus: false,

      activecategory: '',
      load: false,
      
      versionload: false,
      userVersion: [],

      versionSearch: '',

      tweepysearchmode: false,
      

    }),

    methods:{


      initiate_search : function (){

        
        if(this.searchactivetype == "version"){
          this.search_in_version()
        }

        if(this.searchactivetype == "tweepy"){
            this.search_in_tweepy();
        }

      },

      async get_ai_versions (){
          this.versionload = true;
          this.userVersion = []
          try{
              const versions = await this.$axios.get('/Tweet/get_foruser/');  
              const versionlist = await versions.data;

                if(versions.status == 200){
                  this.userVersion = versionlist;
                }

          }catch {

            alert("Failed loading AI versions");

          }
            this.versionload = false;
        },
      
      async search_in_tweepy (){
        this.searchStat = true;
        if(this.tweepysearchmode && this.activecategory == ''){
          this.activecategory = "Others";
        }
        try{
        this.load = true;


        // let url = this.versionSearch == '' ? : '/Tweet/search_from_dataset/?keyword='+`${this.validatestring}`+'&version='+`${this.versionSearch}`;

        let url = '/Tweet/?title='+`${this.validatestring}`+'&style='+`${this.fetch_default_or_sorted}`;


        const tweets = await this.$axios.get(url);
        const ListofTweets = await tweets.data;

        if(tweets.status == 200){
          this.tweetObj = ListofTweets;
        }

        }catch {
          this.searchStat = false;
          alert("Failed to fetch");
        }
        this.load = false;
      },

      async search_in_version (){
        this.searchStat = true;
        if(this.tweepysearchmode && this.activecategory == ''){
          this.activecategory = "Others";
        }
        try{
        this.load = true;


        let url = '/Tweet/search_from_dataset/?keyword='+`${this.validatestring}`+'&version='+`${this.versionSearch}`


        const tweets = await this.$axios.get(url);
        const ListofTweets = await tweets.data;

        if(tweets.status == 200){
          this.tweetObj = ListofTweets;
        }

        }catch {
          this.searchStat = false;
          alert("Failed to fetch");
        }
        this.load = false;
      },

      addToList : function (key){

          let Data = this.this_act_as_search_engine_mode[key];

          this.Approvelist.push(
            Data
          )
          return this.$delete(this.this_act_as_search_engine_mode, key);
      },
      addToList_edited_key : function (){
          
          let Data = this.this_act_as_search_engine_mode[this.activeToEditClass];

          Data.label = this.convert_to_abrevations

            this.editClassText = '';

          this.Approvelist.push(
            Data
          )

        return this.$delete(this.this_act_as_search_engine_mode, this.activeToEditClass);

      },
      Resets : function (){
        this.tweepysearchmode = false
        this.search = ''
        this.searchactivetype = ''
        this.searchactiveStatus = false
        this.searchStat = false;
        this.tweetObj = [];
        this.activecategory = '';
        this.versionSearch = '';
      },

    

  

    },
    computed:{
      validatestring : function (){
        return this.search.replace("#", "%23");
      },


      this_act_as_search_engine_mode : function (){
         /**
         * Display and check if user sets search mode
         * 
         * wait for searchtype
         */

     

          if(this.searchactivetype == "tweepy"){
            
            if(this.tweepysearchmode){

              if(this.activecategory == "Announcement"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.CA.tweets;
              }

              if(this.activecategory == "Others"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.O.tweets; 
              }

              if(this.activecategory == "Casualty and Damage"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.CD.tweets; 
              }

              if(this.activecategory == "Call for Help"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.CH.tweets;
              }

            }else{
              return this.tweetObj.tweets;
            }

          }

          if(this.searchactivetype == "version"){
            
            if(this.tweepysearchmode){

              if(this.activecategory == "Announcement"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.CA.tweets;
              }

              if(this.activecategory == "Others"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.O.tweets; 
              }

              if(this.activecategory == "Casualty and Damage"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.CD.tweets; 
              }

              if(this.activecategory == "Call for Help"){
                console.log(this.tweetObj.CA.tweets)
                return this.tweetObj.CH.tweets;
              }

            }else{
              return this.tweetObj.tweets;
            }

          }

      },

      convert_to_abrevations : function (){

          if(this.editClassText == "Announcement")
            return this.editClassText = "CA";
          if(this.editClassText == "Others")
            return this.editClassText = "O";
          if(this.editClassText == "Casualty and Damage")
            return this.editClassText = "CD";
          if(this.editClassText == "Call for Help")
            return this.editClassText = "CH"
      },

      fetch_default_or_sorted : function () {
        return !this.tweepysearchmode ? "DEFAULT" : "SORTED";
      }

    },

    filters:{
      limitString : function (str){
        
        var trimmedString = str.substring(0, 100);

        return trimmedString + '...';

      },
      
      dateDayAgo : function (val){
        return moment(val).fromNow();
      },

      convertDateFormat : function (val){
        return moment(val).format('MMMM D, YYYY');
      },

      numberFormat : function (num){
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
      }

    },

    mounted (){
      this.get_ai_versions();
    }

  }
</script>

<style lang="scss" scoped>
.qq{
  max-width: 250px;
}
</style>