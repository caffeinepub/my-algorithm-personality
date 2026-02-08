import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, OnlineActivityEntry, Pattern, Program, Habit, DailyCheckIn } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetActivityEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<OnlineActivityEntry[]>({
    queryKey: ['activityEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetActivityEntry(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<OnlineActivityEntry | null>({
    queryKey: ['activityEntry', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getActivityEntry(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAddActivityEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      timestamp: bigint;
      sourceLabel: string;
      notes: string;
      image?: Uint8Array;
      externalBlob?: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addActivityEntry(
        [params.timestamp, params.sourceLabel, params.notes],
        params.image || null,
        params.externalBlob || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityEntries'] });
    },
  });
}

export function useGetPatterns() {
  const { actor, isFetching } = useActor();

  return useQuery<Pattern[]>({
    queryKey: ['patterns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPatterns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPattern() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pattern: Pattern) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPattern(pattern);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns'] });
    },
  });
}

export function useGetHabitLibrary() {
  const { actor, isFetching } = useActor();

  return useQuery<Habit[]>({
    queryKey: ['habitLibrary'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHabitLibrary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedHabitLibrary() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (library: Habit[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.seedHabitLibrary(library);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitLibrary'] });
    },
  });
}

export function useGetProgram() {
  const { actor, isFetching } = useActor();

  return useQuery<Program | null>({
    queryKey: ['program'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProgram();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (program: Program) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProgram(program);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program'] });
    },
  });
}

export function useAddCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkIn: DailyCheckIn) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCheckIn(checkIn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program'] });
    },
  });
}
