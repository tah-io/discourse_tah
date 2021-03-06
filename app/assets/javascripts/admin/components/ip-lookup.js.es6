export default Ember.Component.extend({
  classNames: ["ip-lookup"],

  city: function () {
    return [
      this.get("location.city"),
      this.get("location.region"),
      this.get("location.country")
    ].filter(Boolean).join(", ");
  }.property("location.{city,region,country}"),

  actions: {
    lookup: function () {
      var self = this;
      this.set("show", true);

      if (!this.get("location")) {
        Discourse.ajax("/admin/users/ip-info.json", {
          data: { ip: this.get("ip") }
        }).then(function (location) {
          self.set("location", Em.Object.create(location));
        });
      }

      if (!this.get("other_accounts")) {
        this.set("otherAccountsLoading", true);
        Discourse.AdminUser.findAll("active", {
          "ip": this.get("ip"),
          "exclude": this.get("user_id"),
          "order": "trust_level DESC"
        }).then(function (users) {
          self.setProperties({
            other_accounts: users,
            otherAccountsLoading: false,
          });
        });
      }
    },

    hide: function () {
      this.set("show", false);
    }
  }
});
