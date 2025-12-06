-- Function to increment total_plays
create or replace function increment_total_plays(user_id uuid)
returns void as $$
begin
  update public.profiles
  set total_plays = coalesce(total_plays, 0) + 1
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Function to increment apollyon_wins
create or replace function increment_apollyon_wins(user_id uuid)
returns void as $$
begin
  update public.profiles
  set apollyon_wins = coalesce(apollyon_wins, 0) + 1
  where id = user_id;
end;
$$ language plpgsql security definer;
