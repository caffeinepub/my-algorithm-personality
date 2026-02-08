import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  type Habit = {
    id : Text;
    category : Text;
    action : Text;
    whenToCue : Text;
    duration : Nat;
    difficulty : Int;
    rationale : Text;
  };

  type OnlineActivityEntry = {
    id : Nat;
    timestamp : Int;
    sourceLabel : Text;
    notes : Text;
    image : ?Blob;
    externalBlob : ?Storage.ExternalBlob;
  };

  type Pattern = {
    patternType : Text;
    confidenceScore : Nat;
    snippet : Text;
  };

  type DailyProgramEntry = {
    day : Nat;
    task : Habit;
    reflectionPrompt : ?Text;
    explanation : Text;
  };

  type DailyCheckIn = {
    day : Nat;
    taskCompleted : Bool;
    moodRating : ?Nat;
    notes : Text;
    reducedBehavior : Bool;
  };

  type Program = {
    days : [DailyProgramEntry];
    checkIns : [DailyCheckIn];
  };

  public type UserProfile = {
    name : Text;
  };

  module Habit {
    public func compare(habit1 : Habit, habit2 : Habit) : Order.Order {
      Text.compare(habit1.id, habit2.id);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let habitLibrary = List.empty<Habit>();
  let userActivityEntries = Map.empty<Principal, List.List<OnlineActivityEntry>>();
  let userPatterns = Map.empty<Principal, List.List<Pattern>>();
  let userPrograms = Map.empty<Principal, Program>();
  let userNextIds = Map.empty<Principal, Nat>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func seedHabitLibrary(newLibrary : [Habit]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can seed habit library");
    };
    habitLibrary.clear();
    for (habit in newLibrary.vals()) {
      habitLibrary.add(habit);
    };
  };

  public query ({ caller }) func getHabitLibrary() : async [Habit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access habit library");
    };
    habitLibrary.toArray();
  };

  public shared ({ caller }) func addActivityEntry(entry : (Int, Text, Text), image : ?Blob, externalBlob : ?Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add activity entries");
    };

    let nextId = switch (userNextIds.get(caller)) { case (?id) { id }; case (null) { 0 } };

    let newEntry = {
      id = nextId;
      timestamp = entry.0;
      sourceLabel = entry.1;
      notes = entry.2;
      image;
      externalBlob;
    };

    let entries = switch (userActivityEntries.get(caller)) {
      case (?list) { list };
      case (null) { List.empty<OnlineActivityEntry>() };
    };

    entries.add(newEntry);
    userActivityEntries.add(caller, entries);
    userNextIds.add(caller, nextId + 1);

    newEntry.id;
  };

  public query ({ caller }) func getActivityEntries() : async [OnlineActivityEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access activity entries");
    };
    switch (userActivityEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.toArray() };
    };
  };

  public query ({ caller }) func getActivityEntry(id : Nat) : async ?OnlineActivityEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access activity entries");
    };

    switch (userActivityEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        let entryArray = entries.toArray();
        entryArray.find(func(x) { x.id == id });
      };
    };
  };

  public shared ({ caller }) func addPattern(pattern : Pattern) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add patterns");
    };
    let patterns = switch (userPatterns.get(caller)) {
      case (?p) { p };
      case (null) { List.empty<Pattern>() };
    };
    patterns.add(pattern);
    userPatterns.add(caller, patterns);
  };

  public query ({ caller }) func getPatterns() : async [Pattern] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access patterns");
    };
    switch (userPatterns.get(caller)) {
      case (null) { [] };
      case (?patterns) { patterns.toArray() };
    };
  };

  public shared ({ caller }) func createProgram(program : Program) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create programs");
    };
    userPrograms.add(caller, program);
  };

  public query ({ caller }) func getProgram() : async ?Program {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access programs");
    };
    userPrograms.get(caller);
  };

  public shared ({ caller }) func addCheckIn(checkIn : DailyCheckIn) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add check-ins");
    };
    switch (userPrograms.get(caller)) {
      case (null) { Runtime.trap("No active program found") };
      case (?program) {
        let newCheckIns = [checkIn].concat(program.checkIns);
        let newProgram = { program with checkIns = newCheckIns };
        userPrograms.add(caller, newProgram);
      };
    };
  };
};
